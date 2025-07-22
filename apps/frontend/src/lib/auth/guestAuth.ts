import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

const IDENTITY_POOL_ID = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || '';
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';

export interface GuestCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  identityId: string;
  expiration?: Date;
}

export class GuestAuth {
  private credentials: ReturnType<typeof fromCognitoIdentityPool>;
  private cachedCredentials: GuestCredentials | null = null;
  private isInitialized = false;

  constructor() {
    if (!IDENTITY_POOL_ID) {
      console.warn(
        'VITE_COGNITO_IDENTITY_POOL_ID environment variable is not set'
      );
    }

    this.credentials = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: AWS_REGION }),
      identityPoolId: IDENTITY_POOL_ID,
    });
  }

  async initialize(): Promise<GuestCredentials> {
    try {
      const creds = await this.credentials();

      this.cachedCredentials = {
        accessKeyId: creds.accessKeyId!,
        secretAccessKey: creds.secretAccessKey!,
        sessionToken: creds.sessionToken!,
        identityId: creds.identityId || 'unknown',
        expiration: creds.expiration,
      };

      this.isInitialized = true;

      return this.cachedCredentials;
    } catch (error) {
      throw new Error('Guest authentication failed');
    }
  }

  async getCredentials(): Promise<GuestCredentials> {
    if (!this.isInitialized || !this.cachedCredentials) {
      return await this.initialize();
    }

    if (
      this.cachedCredentials.expiration &&
      new Date() >= this.cachedCredentials.expiration
    ) {
      return await this.initialize();
    }

    return this.cachedCredentials;
  }

  isAuthenticated(): boolean {
    return this.isInitialized && this.cachedCredentials !== null;
  }

  async getAwsConfig() {
    const creds = await this.getCredentials();

    return {
      region: AWS_REGION,
      credentials: {
        accessKeyId: creds.accessKeyId,
        secretAccessKey: creds.secretAccessKey,
        sessionToken: creds.sessionToken,
      },
    };
  }

  async getAppSyncConfig() {
    const creds = await this.getCredentials();

    return {
      region: AWS_REGION,
      credentials: creds,
      authMode: 'AWS_IAM' as const,
    };
  }

  clearCredentials(): void {
    this.cachedCredentials = null;
    this.isInitialized = false;
  }
}

// Singleton instance
export const guestAuth = new GuestAuth();
