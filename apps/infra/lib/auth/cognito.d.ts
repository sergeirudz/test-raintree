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
    /**
     * Add basic policies that are commonly needed for unauthenticated users
     */
    private addBasicUnauthenticatedPolicies;
    /**
     * Add a custom policy statement to the unauthenticated role
     */
    addPolicyStatement(statement: iam.PolicyStatement): void;
    /**
     * Grant permissions to access DynamoDB tables (read-only for guests)
     */
    grantReadOnlyDynamoDBAccess(tableArns: string[]): void;
    /**
     * Grant permissions to invoke specific Lambda functions
     */
    grantLambdaInvokeAccess(functionArns: string[]): void;
    /**
     * Grant permissions to access S3 buckets (read-only for guests)
     */
    grantS3ReadAccess(bucketArns: string[]): void;
    /**
     * Grant permissions to access AppSync GraphQL API
     */
    grantAppSyncAccess(apiArn: string): void;
}
