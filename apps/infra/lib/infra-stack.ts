import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { createTable } from './tables/createTable';
import { createAppSyncAPI } from './api/appsync';
import { createAmplifyHosting } from './hosting/amplify';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'InfraQueue', {
      visibilityTimeout: Duration.seconds(300),
    });

    const topic = new sns.Topic(this, 'InfraTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

    const amplifyAppName = 'Frontend';

    const amplifyRole = new iam.Role(this, 'AmplifyRole', {
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AdministratorAccess-Amplify'
        ),
      ],
    });

    const dynamoDBTable = createTable(this, {
      tableName: 'appDataTable',
    });

    createAppSyncAPI(this, {
      apiName: 'weights-api',
      dataTable: dynamoDBTable,
    });

    createAmplifyHosting(this, {
      appName: amplifyAppName,
      role: amplifyRole,
    });
  }
}
