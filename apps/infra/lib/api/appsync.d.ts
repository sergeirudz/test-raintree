import { GraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { CognitoAuth } from '../auth';
type AppSyncAPIProps = {
    apiName: string;
    dataTable: Table;
    cognitoAuth?: CognitoAuth;
};
export declare const createAppSyncAPI: (scope: Construct, props: AppSyncAPIProps) => GraphqlApi;
export {};
