import { GraphqlApi } from 'aws-cdk-lib/aws-appsync';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
type AppSyncAPIProps = {
    apiName: string;
    dataTable: Table;
};
export declare const createAppSyncAPI: (scope: Construct, props: AppSyncAPIProps) => GraphqlApi;
export {};
