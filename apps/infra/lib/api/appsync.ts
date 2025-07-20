import {
  AuthorizationType,
  Definition,
  FieldLogLevel,
  GraphqlApi,
  FunctionRuntime,
  Code,
  AppsyncFunction,
} from 'aws-cdk-lib/aws-appsync';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Function, Runtime, Code as LambdaCode } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CognitoAuth } from '../auth';
import * as path from 'path';

type AppSyncAPIProps = {
  apiName: string;
  dataTable: Table;
  cognitoAuth?: CognitoAuth;
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
  const authorizationConfig = {
    defaultAuthorization: {
      authorizationType: AuthorizationType.API_KEY,
    },
    additionalAuthorizationModes: props.cognitoAuth
      ? [
          {
            authorizationType: AuthorizationType.IAM,
          },
        ]
      : undefined,
  };

  const api = new GraphqlApi(scope, props.apiName, {
    name: props.apiName,
    definition: Definition.fromFile(schemaPath),
    authorizationConfig,
    logConfig: {
      fieldLogLevel: FieldLogLevel.ALL,
    },
    xrayEnabled: true,
  });

  if (props.cognitoAuth) {
    props.cognitoAuth.grantAppSyncAccess(api.arn);
  }

  const appDataSource = api.addDynamoDbDataSource('AppDataDS', props.dataTable);

  const validateWeightLambda = new Function(scope, 'ValidateWeightFunction', {
    runtime: Runtime.NODEJS_18_X,
    handler: 'validateWeight.handler',
    code: LambdaCode.fromAsset(path.join(__dirname, '../functions')),
    timeout: Duration.seconds(30),
    memorySize: 256,
  });

  const lambdaDataSource = api.addLambdaDataSource(
    'ValidateWeightDataSource',
    validateWeightLambda
  );

  const validateWeightFunction = new AppsyncFunction(
    scope,
    'ValidateWeightAppsyncFunction',
    {
      name: 'validateWeightFunction',
      api,
      dataSource: lambdaDataSource,
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(
        path.join(resolverPath, 'pipeline/validateWeight.js')
      ),
    }
  );

  const createWeightFunction = new AppsyncFunction(
    scope,
    'CreateWeightAppsyncFunction',
    {
      name: 'createWeightFunction',
      api,
      dataSource: appDataSource,
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(
        path.join(resolverPath, 'mutations/createWeight.js')
      ),
    }
  );

  const updateWeightFunction = new AppsyncFunction(
    scope,
    'UpdateWeightAppsyncFunction',
    {
      name: 'updateWeightFunction',
      api,
      dataSource: appDataSource,
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromAsset(
        path.join(resolverPath, 'mutations/updateWeight.js')
      ),
    }
  );

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

  api.createResolver('listWeightsByUserResolver', {
    typeName: 'Query',
    fieldName: 'listWeightsByUser',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(
      path.join(resolverPath, 'queries/listWeightsByUser.js')
    ),
  });

  api.createResolver('createUserResolver', {
    typeName: 'Mutation',
    fieldName: 'createUser',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(resolverPath, 'mutations/createUser.js')),
  });

  api.createResolver('updateUserResolver', {
    typeName: 'Mutation',
    fieldName: 'updateUser',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(resolverPath, 'mutations/updateUser.js')),
  });

  api.createResolver('deleteUserResolver', {
    typeName: 'Mutation',
    fieldName: 'deleteUser',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(resolverPath, 'mutations/deleteUser.js')),
  });

  api.createResolver('createWeightResolver', {
    typeName: 'Mutation',
    fieldName: 'createWeight',
    runtime: FunctionRuntime.JS_1_0_0,
    pipelineConfig: [validateWeightFunction, createWeightFunction],
    code: Code.fromAsset(
      path.join(resolverPath, 'pipeline/createWeightPipeline.js')
    ),
  });

  api.createResolver('updateWeightResolver', {
    typeName: 'Mutation',
    fieldName: 'updateWeight',
    runtime: FunctionRuntime.JS_1_0_0,
    pipelineConfig: [validateWeightFunction, updateWeightFunction],
    code: Code.fromAsset(
      path.join(resolverPath, 'pipeline/updateWeightPipeline.js')
    ),
  });

  api.createResolver('deleteWeightResolver', {
    typeName: 'Mutation',
    fieldName: 'deleteWeight',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(path.join(resolverPath, 'mutations/deleteWeight.js')),
  });

  api.createResolver('userWeightsFieldResolver', {
    typeName: 'User',
    fieldName: 'weights',
    dataSource: appDataSource,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromAsset(
      path.join(resolverPath, 'fieldResolvers/User.weights.js')
    ),
  });

  return api;
};
