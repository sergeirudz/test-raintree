import {
  AuthorizationType,
  Definition,
  FieldLogLevel,
  GraphqlApi,
  FunctionRuntime,
  Code,
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

const resolverPath = path.join(
  __dirname,
  '../../../../packages/appsync-resolvers/build'
);

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

  // Add the DynamoDB datasource
  const appDataSource = api.addDynamoDbDataSource('AppDataDS', props.dataTable);

  // Add Query resolvers
  api.createResolver('getUserResolver', {
    typeName: 'Query',
    fieldName: 'getUser',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(resolverPath, 'queries/getUser.js')),
  });

  api.createResolver('listUsersResolver', {
    typeName: 'Query',
    fieldName: 'listUsers',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(resolverPath, 'queries/listUsers.js')),
  });

  api.createResolver('getWeightResolver', {
    typeName: 'Query',
    fieldName: 'getWeight',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(resolverPath, 'queries/getWeight.js')),
  });

  // Add Mutation resolvers
  api.createResolver('createUserResolver', {
    typeName: 'Mutation',
    fieldName: 'createUser',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(resolverPath, 'mutations/createUser.js')),
  });

  api.createResolver('createWeightResolver', {
    typeName: 'Mutation',
    fieldName: 'createWeight',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(resolverPath, 'mutations/createWeight.js')),
  });

  return api;
};
