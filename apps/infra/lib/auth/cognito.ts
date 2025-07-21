import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface CognitoAuthProps {
  identityPoolName?: string;
  additionalPolicyStatements?: iam.PolicyStatement[];
  resourceArns?: string[];
}

export class CognitoAuth extends Construct {
  public readonly identityPool: cognito.CfnIdentityPool;
  public readonly identityPoolId: string;
  public readonly unauthenticatedRole: iam.Role;

  constructor(scope: Construct, id: string, props?: CognitoAuthProps) {
    super(scope, id);

    this.identityPool = new cognito.CfnIdentityPool(this, 'GuestIdentityPool', {
      identityPoolName: props?.identityPoolName || 'RaintreeGuestIdentityPool',
      allowUnauthenticatedIdentities: true,
    });

    this.unauthenticatedRole = new iam.Role(this, 'UnauthenticatedRole', {
      roleName: `${cdk.Stack.of(this).stackName}-cognito-unauth-role`,
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'unauthenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });

    this.addBasicUnauthenticatedPolicies(props?.resourceArns);

    if (props?.additionalPolicyStatements) {
      props.additionalPolicyStatements.forEach((statement) => {
        this.unauthenticatedRole.addToPolicy(statement);
      });
    }

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      'IdentityPoolRoleAttachment',
      {
        identityPoolId: this.identityPool.ref,
        roles: {
          unauthenticated: this.unauthenticatedRole.roleArn,
        },
      }
    );

    this.identityPoolId = this.identityPool.ref;

    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: this.identityPoolId,
      description: 'The ID of the Cognito Identity Pool for guest access',
      exportName: `${cdk.Stack.of(this).stackName}-cognito-identity-pool-id`,
    });

    new cdk.CfnOutput(this, 'UnauthenticatedRoleArn', {
      value: this.unauthenticatedRole.roleArn,
      description: 'ARN of the unauthenticated role',
      exportName: `${cdk.Stack.of(this).stackName}-cognito-unauth-role-arn`,
    });
  }

  private addBasicUnauthenticatedPolicies(resourceArns?: string[]) {
    const basicPolicyStatements: iam.PolicyStatement[] = [];

    if (resourceArns && resourceArns.length > 0) {
      basicPolicyStatements.push(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'geo:GetMap*',
            'geo:SearchPlaceIndex*',
            'geo:GetPlace',
            'geo:CalculateRoute*',
            'geo:GetGeofence',
            'geo:ListGeofences',
            'geo:GetDevicePosition*',
            'geo:ListDevicePositions',
            'geo:BatchGetDevicePosition',
          ],
          resources: resourceArns,
        })
      );
    }

    basicPolicyStatements.push(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: [
          `arn:aws:logs:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:log-group:/aws/cognito/*`,
        ],
      })
    );

    basicPolicyStatements.forEach((statement) => {
      this.unauthenticatedRole.addToPolicy(statement);
    });
  }

  public addPolicyStatement(statement: iam.PolicyStatement): void {
    this.unauthenticatedRole.addToPolicy(statement);
  }

  public grantReadOnlyDynamoDBAccess(tableArns: string[]): void {
    this.unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'dynamodb:GetItem',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:BatchGetItem',
        ],
        resources: tableArns,
      })
    );
  }

  public grantFullDynamoDBAccess(tableArns: string[]): void {
    const allTableResources = tableArns.flatMap((arn) => [
      arn,
      `${arn}/*`,
      `${arn}/index/*`,
    ]);

    this.unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:BatchGetItem',
          'dynamodb:BatchWriteItem',
        ],
        resources: allTableResources,
      })
    );
  }

  public grantLambdaInvokeAccess(functionArns: string[]): void {
    this.unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['lambda:InvokeFunction'],
        resources: functionArns,
      })
    );
  }

  public grantAppSyncAccess(apiArn: string): void {
    this.unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['appsync:GraphQL'],
        resources: [`${apiArn}/*`],
      })
    );
  }
}
