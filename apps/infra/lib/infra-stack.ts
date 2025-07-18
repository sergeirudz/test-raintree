import { App, GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify-alpha';
import { Duration, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'InfraQueue', {
      visibilityTimeout: Duration.seconds(300),
    });

    const topic = new sns.Topic(this, 'InfraTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

    const amplifyAppName = 'Frontend';

    const amplifyApp = new App(this, amplifyAppName, {
      environmentVariables: {
        AMPLIFY_MONOREPO_APP_ROOT: 'apps/web',
      },
      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: 'sergeirudz',
        repository: 'test-raintree',
        oauthToken: SecretValue.secretsManager('github-token'),
      }),
      buildSpec: BuildSpec.fromObjectToYaml({
        version: '1.0',
        applications: [
          {
            frontend: {
              phases: {
                preBuild: {
                  commands: ['npm ci'],
                },
                build: {
                  commands: ['pnpm run build'],
                },
              },
              artifacts: {
                baseDirectory: 'dist',
                files: '**/*',
              },
              cache: {
                paths: ['node_modules/**/**'],
              },
              appRoot: 'apps/web',
            },
          },
        ],
      }),
    });
    const mainBranch = amplifyApp.addBranch('deploy-front');
  }
}
