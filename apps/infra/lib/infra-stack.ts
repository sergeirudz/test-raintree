import { App, GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify-alpha';
import { Duration, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

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

    const amplifyApp = new App(this, amplifyAppName, {
      role: amplifyRole,
      environmentVariables: {
        AMPLIFY_MONOREPO_APP_ROOT: 'apps/web',
        _CUSTOM_IMAGE: 'amplify:al2023',
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
            appRoot: 'apps/web',
            frontend: {
              phases: {
                preBuild: {
                  commands: [
                    'cd ../..',
                    'pwd',
                    'ls -la',
                    'corepack enable',
                    'corepack prepare pnpm@latest --activate',
                    'pnpm install --frozen-lockfile',
                  ],
                },
                build: {
                  commands: ['pnpm turbo run build --filter=@repo/web'],
                },
              },
              artifacts: {
                baseDirectory: 'dist',
                files: ['**/*'],
              },
              cache: {
                paths: ['../../node_modules/**/*', '../../.turbo/**/*'],
              },
            },
          },
        ],
      }),
    });
    amplifyApp.addBranch('deploy-front');
  }
}
