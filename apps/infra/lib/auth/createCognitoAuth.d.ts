import { Construct } from 'constructs';
import { CognitoAuth, CognitoAuthProps } from './cognito';
/**
 * Creates a Cognito Identity Pool for guest/unauthenticated access
 *
 * @param scope The construct scope
 * @param props Configuration props for the Cognito setup
 * @returns The CognitoAuth construct instance
 */
export declare function createCognitoAuth(scope: Construct, props?: CognitoAuthProps): CognitoAuth;
