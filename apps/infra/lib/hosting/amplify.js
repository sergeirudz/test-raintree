"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAmplifyHosting = createAmplifyHosting;
const aws_amplify_alpha_1 = require("@aws-cdk/aws-amplify-alpha");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_codebuild_1 = require("aws-cdk-lib/aws-codebuild");
function createAmplifyHosting(scope, props) {
    const environmentVariables = {
        AMPLIFY_MONOREPO_APP_ROOT: 'apps/frontend',
        _CUSTOM_IMAGE: 'amplify:al2023',
        VITE_AWS_REGION: 'us-east-1',
        VITE_GRAPHQL_ENDPOINT: 'https://7brh2kkhi5fohdle6zrr2nrrby.appsync-api.us-east-1.amazonaws.com/graphql',
    };
    if (props.cognitoAuth) {
        environmentVariables.VITE_COGNITO_IDENTITY_POOL_ID =
            props.cognitoAuth.identityPoolId;
    }
    const amplifyApp = new aws_amplify_alpha_1.App(scope, props.appName, {
        role: props.role,
        environmentVariables,
        platform: aws_amplify_alpha_1.Platform.WEB, // WEB_COMPUTE === SSR
        sourceCodeProvider: new aws_amplify_alpha_1.GitHubSourceCodeProvider({
            owner: 'sergeirudz',
            repository: 'test-raintree',
            oauthToken: aws_cdk_lib_1.SecretValue.secretsManager('github-token'),
        }),
        autoBranchDeletion: true,
        buildSpec: aws_codebuild_1.BuildSpec.fromObjectToYaml({
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
    amplifyApp.addBranch('deploy-front');
    return amplifyApp;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFpQkEsb0RBZ0VDO0FBakZELGtFQUlvQztBQUNwQyw2Q0FBMEM7QUFDMUMsNkRBQXNEO0FBV3RELFNBQWdCLG9CQUFvQixDQUNsQyxLQUFnQixFQUNoQixLQUEwQjtJQUUxQixNQUFNLG9CQUFvQixHQUEyQjtRQUNuRCx5QkFBeUIsRUFBRSxlQUFlO1FBQzFDLGFBQWEsRUFBRSxnQkFBZ0I7UUFDL0IsZUFBZSxFQUFFLFdBQVc7UUFDNUIscUJBQXFCLEVBQ25CLGdGQUFnRjtLQUNuRixDQUFDO0lBRUYsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdEIsb0JBQW9CLENBQUMsNkJBQTZCO1lBQ2hELEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7UUFDL0MsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1FBQ2hCLG9CQUFvQjtRQUNwQixRQUFRLEVBQUUsNEJBQVEsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCO1FBQzlDLGtCQUFrQixFQUFFLElBQUksNENBQXdCLENBQUM7WUFDL0MsS0FBSyxFQUFFLFlBQVk7WUFDbkIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsVUFBVSxFQUFFLHlCQUFXLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQztTQUN2RCxDQUFDO1FBQ0Ysa0JBQWtCLEVBQUUsSUFBSTtRQUN4QixTQUFTLEVBQUUseUJBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNwQyxPQUFPLEVBQUUsS0FBSztZQUNkLFlBQVksRUFBRTtnQkFDWjtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDTixRQUFRLEVBQUU7Z0NBQ1IsUUFBUSxFQUFFO29DQUNSLFVBQVU7b0NBQ1YsS0FBSztvQ0FDTCxRQUFRO29DQUNSLGlCQUFpQjtvQ0FDakIseUNBQXlDO29DQUN6QyxnQ0FBZ0M7aUNBQ2pDOzZCQUNGOzRCQUNELEtBQUssRUFBRTtnQ0FDTCxRQUFRLEVBQUUsQ0FBQyw4Q0FBOEMsQ0FBQzs2QkFDM0Q7eUJBQ0Y7d0JBQ0QsU0FBUyxFQUFFOzRCQUNULGFBQWEsRUFBRSxNQUFNOzRCQUNyQixLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7eUJBQ2hCO3dCQUNELEtBQUssRUFBRTs0QkFDTCxLQUFLLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxtQkFBbUIsQ0FBQzt5QkFDeEQ7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxVQUFVLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRXJDLE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBcHAsXG4gIEdpdEh1YlNvdXJjZUNvZGVQcm92aWRlcixcbiAgUGxhdGZvcm0sXG59IGZyb20gJ0Bhd3MtY2RrL2F3cy1hbXBsaWZ5LWFscGhhJztcbmltcG9ydCB7IFNlY3JldFZhbHVlIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQnVpbGRTcGVjIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvZ25pdG9BdXRoIH0gZnJvbSAnLi4vYXV0aCc7XG5cbnR5cGUgQW1wbGlmeUhvc3RpbmdQcm9wcyA9IHtcbiAgYXBwTmFtZTogc3RyaW5nO1xuICByb2xlOiBpYW0uUm9sZTtcbiAgY29nbml0b0F1dGg/OiBDb2duaXRvQXV0aDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBbXBsaWZ5SG9zdGluZyhcbiAgc2NvcGU6IENvbnN0cnVjdCxcbiAgcHJvcHM6IEFtcGxpZnlIb3N0aW5nUHJvcHNcbikge1xuICBjb25zdCBlbnZpcm9ubWVudFZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBBTVBMSUZZX01PTk9SRVBPX0FQUF9ST09UOiAnYXBwcy9mcm9udGVuZCcsXG4gICAgX0NVU1RPTV9JTUFHRTogJ2FtcGxpZnk6YWwyMDIzJyxcbiAgICBWSVRFX0FXU19SRUdJT046ICd1cy1lYXN0LTEnLFxuICAgIFZJVEVfR1JBUEhRTF9FTkRQT0lOVDpcbiAgICAgICdodHRwczovLzdicmgya2toaTVmb2hkbGU2enJyMm5ycmJ5LmFwcHN5bmMtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL2dyYXBocWwnLFxuICB9O1xuXG4gIGlmIChwcm9wcy5jb2duaXRvQXV0aCkge1xuICAgIGVudmlyb25tZW50VmFyaWFibGVzLlZJVEVfQ09HTklUT19JREVOVElUWV9QT09MX0lEID1cbiAgICAgIHByb3BzLmNvZ25pdG9BdXRoLmlkZW50aXR5UG9vbElkO1xuICB9XG5cbiAgY29uc3QgYW1wbGlmeUFwcCA9IG5ldyBBcHAoc2NvcGUsIHByb3BzLmFwcE5hbWUsIHtcbiAgICByb2xlOiBwcm9wcy5yb2xlLFxuICAgIGVudmlyb25tZW50VmFyaWFibGVzLFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybS5XRUIsIC8vIFdFQl9DT01QVVRFID09PSBTU1JcbiAgICBzb3VyY2VDb2RlUHJvdmlkZXI6IG5ldyBHaXRIdWJTb3VyY2VDb2RlUHJvdmlkZXIoe1xuICAgICAgb3duZXI6ICdzZXJnZWlydWR6JyxcbiAgICAgIHJlcG9zaXRvcnk6ICd0ZXN0LXJhaW50cmVlJyxcbiAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCdnaXRodWItdG9rZW4nKSxcbiAgICB9KSxcbiAgICBhdXRvQnJhbmNoRGVsZXRpb246IHRydWUsXG4gICAgYnVpbGRTcGVjOiBCdWlsZFNwZWMuZnJvbU9iamVjdFRvWWFtbCh7XG4gICAgICB2ZXJzaW9uOiAnMS4wJyxcbiAgICAgIGFwcGxpY2F0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgYXBwUm9vdDogJ2FwcHMvZnJvbnRlbmQnLFxuICAgICAgICAgIGZyb250ZW5kOiB7XG4gICAgICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICAgICAgcHJlQnVpbGQ6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgICAgICAgJ2NkIC4uLy4uJyxcbiAgICAgICAgICAgICAgICAgICdwd2QnLFxuICAgICAgICAgICAgICAgICAgJ2xzIC1sYScsXG4gICAgICAgICAgICAgICAgICAnY29yZXBhY2sgZW5hYmxlJyxcbiAgICAgICAgICAgICAgICAgICdjb3JlcGFjayBwcmVwYXJlIHBucG1AbGF0ZXN0IC0tYWN0aXZhdGUnLFxuICAgICAgICAgICAgICAgICAgJ3BucG0gaW5zdGFsbCAtLWZyb3plbi1sb2NrZmlsZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kczogWydwbnBtIHR1cmJvIHJ1biBidWlsZCAtLWZpbHRlcj1AcmVwby9mcm9udGVuZCddLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFydGlmYWN0czoge1xuICAgICAgICAgICAgICBiYXNlRGlyZWN0b3J5OiAnZGlzdCcsXG4gICAgICAgICAgICAgIGZpbGVzOiBbJyoqLyonXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWNoZToge1xuICAgICAgICAgICAgICBwYXRoczogWycuLi8uLi9ub2RlX21vZHVsZXMvKiovKicsICcuLi8uLi8udHVyYm8vKiovKiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgYW1wbGlmeUFwcC5hZGRCcmFuY2goJ2RlcGxveS1mcm9udCcpO1xuXG4gIHJldHVybiBhbXBsaWZ5QXBwO1xufVxuIl19