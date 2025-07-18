import {
  AuthorizationType,
  Definition,
  FieldLogLevel,
  GraphqlApi,
} from 'aws-cdk-lib/aws-appsync';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as path from 'path';

type AppSyncAPIProps = {
  apiName: string;
  dataTable: Table; // Single table for both entities
};

const schemaPath = path.join(
  __dirname,
  '../../../../packages/graphql/schema.graphql'
);

console.log('Schema path:', schemaPath);
console.log('__dirname:', __dirname);

export const createAppSyncAPI = (scope: Construct, props: AppSyncAPIProps) => {
  const api = new GraphqlApi(scope, props.apiName, {
    name: props.apiName,
    definition: Definition.fromFile(schemaPath),
    authorizationConfig: {
      defaultAuthorization: {
        authorizationType: AuthorizationType.API_KEY,
      },
    },
    logConfig: {
      fieldLogLevel: FieldLogLevel.ALL,
    },
    xrayEnabled: true,
  });

  api.addDynamoDbDataSource('AppDataDS', props.dataTable);

  return api;
};
