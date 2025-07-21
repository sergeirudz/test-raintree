import {
  App,
  GitHubSourceCodeProvider,
  Platform,
} from '@aws-cdk/aws-amplify-alpha';
import { SecretValue } from 'aws-cdk-lib';
import { BuildSpec } from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CognitoAuth } from '../auth';

type AmplifyHostingProps = {
  appName: string;
  role: iam.Role;
  cognitoAuth?: CognitoAuth;
};

export function createAmplifyHosting(
  scope: Construct,
  props: AmplifyHostingProps
) {
  const environmentVariables: Record<string, string> = {
    AMPLIFY_MONOREPO_APP_ROOT: 'apps/frontend',
    VITE_AWS_REGION: 'us-east-1',
    VITE_GRAPHQL_ENDPOINT:
      'https://437vjdrzsbbppihxcxdyn535oi.appsync-api.us-east-1.amazonaws.com/graphql',
    VITE_COGNITO_IDENTITY_POOL_ID:
      'us-east-1:fa7c8cb7-4910-416d-99d5-904b7dc8749e',
  };

  const amplifyApp = new App(scope, props.appName, {
    role: props.role,
    environmentVariables,
    platform: Platform.WEB, // WEB_COMPUTE === SSR
    sourceCodeProvider: new GitHubSourceCodeProvider({
      owner: 'sergeirudz',
      repository: 'test-raintree',
      oauthToken: SecretValue.secretsManager('github-token'),
    }),
    autoBranchDeletion: true,
    buildSpec: BuildSpec.fromObjectToYaml({
      version: '1.0',
      applications: [
        {
          appRoot: 'apps/frontend',
          frontend: {
            phases: {
              preBuild: {
                commands: [
                  'cd ../..',
                  'pwd',
                  'ls -la',
                  'echo "Node version:"',
                  'node --version',
                  'echo "NPM version:"',
                  'npm --version',
                  'npm install -g pnpm@latest',
                  'pnpm --version',
                  'pnpm install --frozen-lockfile',
                  'echo "Dependencies installed successfully"',
                ],
              },
              build: {
                commands: ['pnpm turbo run build --filter=@repo/frontend'],
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

  amplifyApp.addBranch('main');

  return amplifyApp;
}
