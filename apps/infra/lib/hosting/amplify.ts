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
    _CUSTOM_IMAGE: 'amplify:al2023',
    VITE_AWS_REGION: 'us-east-1',
    VITE_GRAPHQL_ENDPOINT:
      'https://7brh2kkhi5fohdle6zrr2nrrby.appsync-api.us-east-1.amazonaws.com/graphql',
  };

  if (props.cognitoAuth) {
    environmentVariables.VITE_COGNITO_IDENTITY_POOL_ID =
      props.cognitoAuth.identityPoolId;
  }

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
                  'corepack enable',
                  'corepack prepare pnpm@latest --activate',
                  'pnpm install --frozen-lockfile',
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
