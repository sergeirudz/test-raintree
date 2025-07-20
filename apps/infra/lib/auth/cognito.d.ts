import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
export interface CognitoAuthProps {
    /**
     * Name for the identity pool
     */
    identityPoolName?: string;
    /**
     * Additional IAM policy statements for unauthenticated users
     */
    additionalPolicyStatements?: iam.PolicyStatement[];
    /**
     * Resource ARNs that unauthenticated users should have access to
     */
    resourceArns?: string[];
}
export declare class CognitoAuth extends Construct {
    readonly identityPool: cognito.CfnIdentityPool;
    readonly identityPoolId: string;
    readonly unauthenticatedRole: iam.Role;
    constructor(scope: Construct, id: string, props?: CognitoAuthProps);
    private addBasicUnauthenticatedPolicies;
    addPolicyStatement(statement: iam.PolicyStatement): void;
    grantReadOnlyDynamoDBAccess(tableArns: string[]): void;
    grantLambdaInvokeAccess(functionArns: string[]): void;
    grantAppSyncAccess(apiArn: string): void;
}
