import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
export interface CognitoAuthProps {
    identityPoolName?: string;
    additionalPolicyStatements?: iam.PolicyStatement[];
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
    grantFullDynamoDBAccess(tableArns: string[]): void;
    grantLambdaInvokeAccess(functionArns: string[]): void;
    grantAppSyncAccess(apiArn: string): void;
}
