"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAmplifyHosting = createAmplifyHosting;
const aws_amplify_alpha_1 = require("@aws-cdk/aws-amplify-alpha");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_codebuild_1 = require("aws-cdk-lib/aws-codebuild");
function createAmplifyHosting(scope, props) {
    const amplifyApp = new aws_amplify_alpha_1.App(scope, props.appName, {
        role: props.role,
        environmentVariables: {
            AMPLIFY_MONOREPO_APP_ROOT: 'apps/frontend',
            _CUSTOM_IMAGE: 'amplify:al2023',
            VITE_GRAPHQL_ENDPOINT: 'https://7brh2kkhi5fohdle6zrr2nrrby.appsync-api.us-east-1.amazonaws.com/graphql',
            VITE_APPSYNC_API_KEY: 'da2-dzqcg6swyjfibpttbs2pql6h4a',
            VITE_APPSYNC_REGION: 'us-east-1',
            VITE_APPSYNC_DEFAULT_AUTH_MODE: 'apiKey',
        },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFlQSxvREEyREM7QUExRUQsa0VBSW9DO0FBQ3BDLDZDQUEwQztBQUMxQyw2REFBc0Q7QUFTdEQsU0FBZ0Isb0JBQW9CLENBQ2xDLEtBQWdCLEVBQ2hCLEtBQTBCO0lBRTFCLE1BQU0sVUFBVSxHQUFHLElBQUksdUJBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtRQUMvQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7UUFDaEIsb0JBQW9CLEVBQUU7WUFDcEIseUJBQXlCLEVBQUUsZUFBZTtZQUMxQyxhQUFhLEVBQUUsZ0JBQWdCO1lBQy9CLHFCQUFxQixFQUNuQixnRkFBZ0Y7WUFDbEYsb0JBQW9CLEVBQUUsZ0NBQWdDO1lBQ3RELG1CQUFtQixFQUFFLFdBQVc7WUFDaEMsOEJBQThCLEVBQUUsUUFBUTtTQUN6QztRQUNELFFBQVEsRUFBRSw0QkFBUSxDQUFDLEdBQUcsRUFBRSxzQkFBc0I7UUFDOUMsa0JBQWtCLEVBQUUsSUFBSSw0Q0FBd0IsQ0FBQztZQUMvQyxLQUFLLEVBQUUsWUFBWTtZQUNuQixVQUFVLEVBQUUsZUFBZTtZQUMzQixVQUFVLEVBQUUseUJBQVcsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO1NBQ3ZELENBQUM7UUFDRixrQkFBa0IsRUFBRSxJQUFJO1FBQ3hCLFNBQVMsRUFBRSx5QkFBUyxDQUFDLGdCQUFnQixDQUFDO1lBQ3BDLE9BQU8sRUFBRSxLQUFLO1lBQ2QsWUFBWSxFQUFFO2dCQUNaO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixRQUFRLEVBQUU7d0JBQ1IsTUFBTSxFQUFFOzRCQUNOLFFBQVEsRUFBRTtnQ0FDUixRQUFRLEVBQUU7b0NBQ1IsVUFBVTtvQ0FDVixLQUFLO29DQUNMLFFBQVE7b0NBQ1IsaUJBQWlCO29DQUNqQix5Q0FBeUM7b0NBQ3pDLGdDQUFnQztpQ0FDakM7NkJBQ0Y7NEJBQ0QsS0FBSyxFQUFFO2dDQUNMLFFBQVEsRUFBRSxDQUFDLDhDQUE4QyxDQUFDOzZCQUMzRDt5QkFDRjt3QkFDRCxTQUFTLEVBQUU7NEJBQ1QsYUFBYSxFQUFFLE1BQU07NEJBQ3JCLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQzt5QkFDaEI7d0JBQ0QsS0FBSyxFQUFFOzRCQUNMLEtBQUssRUFBRSxDQUFDLHlCQUF5QixFQUFFLG1CQUFtQixDQUFDO3lCQUN4RDtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQztJQUVILFVBQVUsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFckMsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFwcCxcbiAgR2l0SHViU291cmNlQ29kZVByb3ZpZGVyLFxuICBQbGF0Zm9ybSxcbn0gZnJvbSAnQGF3cy1jZGsvYXdzLWFtcGxpZnktYWxwaGEnO1xuaW1wb3J0IHsgU2VjcmV0VmFsdWUgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBCdWlsZFNwZWMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG50eXBlIEFtcGxpZnlIb3N0aW5nUHJvcHMgPSB7XG4gIGFwcE5hbWU6IHN0cmluZztcbiAgcm9sZTogaWFtLlJvbGU7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQW1wbGlmeUhvc3RpbmcoXG4gIHNjb3BlOiBDb25zdHJ1Y3QsXG4gIHByb3BzOiBBbXBsaWZ5SG9zdGluZ1Byb3BzXG4pIHtcbiAgY29uc3QgYW1wbGlmeUFwcCA9IG5ldyBBcHAoc2NvcGUsIHByb3BzLmFwcE5hbWUsIHtcbiAgICByb2xlOiBwcm9wcy5yb2xlLFxuICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICBBTVBMSUZZX01PTk9SRVBPX0FQUF9ST09UOiAnYXBwcy9mcm9udGVuZCcsXG4gICAgICBfQ1VTVE9NX0lNQUdFOiAnYW1wbGlmeTphbDIwMjMnLFxuICAgICAgVklURV9HUkFQSFFMX0VORFBPSU5UOlxuICAgICAgICAnaHR0cHM6Ly83YnJoMmtraGk1Zm9oZGxlNnpycjJucnJieS5hcHBzeW5jLWFwaS51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS9ncmFwaHFsJyxcbiAgICAgIFZJVEVfQVBQU1lOQ19BUElfS0VZOiAnZGEyLWR6cWNnNnN3eWpmaWJwdHRiczJwcWw2aDRhJyxcbiAgICAgIFZJVEVfQVBQU1lOQ19SRUdJT046ICd1cy1lYXN0LTEnLFxuICAgICAgVklURV9BUFBTWU5DX0RFRkFVTFRfQVVUSF9NT0RFOiAnYXBpS2V5JyxcbiAgICB9LFxuICAgIHBsYXRmb3JtOiBQbGF0Zm9ybS5XRUIsIC8vIFdFQl9DT01QVVRFID09PSBTU1JcbiAgICBzb3VyY2VDb2RlUHJvdmlkZXI6IG5ldyBHaXRIdWJTb3VyY2VDb2RlUHJvdmlkZXIoe1xuICAgICAgb3duZXI6ICdzZXJnZWlydWR6JyxcbiAgICAgIHJlcG9zaXRvcnk6ICd0ZXN0LXJhaW50cmVlJyxcbiAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCdnaXRodWItdG9rZW4nKSxcbiAgICB9KSxcbiAgICBhdXRvQnJhbmNoRGVsZXRpb246IHRydWUsXG4gICAgYnVpbGRTcGVjOiBCdWlsZFNwZWMuZnJvbU9iamVjdFRvWWFtbCh7XG4gICAgICB2ZXJzaW9uOiAnMS4wJyxcbiAgICAgIGFwcGxpY2F0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgYXBwUm9vdDogJ2FwcHMvZnJvbnRlbmQnLFxuICAgICAgICAgIGZyb250ZW5kOiB7XG4gICAgICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICAgICAgcHJlQnVpbGQ6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgICAgICAgJ2NkIC4uLy4uJyxcbiAgICAgICAgICAgICAgICAgICdwd2QnLFxuICAgICAgICAgICAgICAgICAgJ2xzIC1sYScsXG4gICAgICAgICAgICAgICAgICAnY29yZXBhY2sgZW5hYmxlJyxcbiAgICAgICAgICAgICAgICAgICdjb3JlcGFjayBwcmVwYXJlIHBucG1AbGF0ZXN0IC0tYWN0aXZhdGUnLFxuICAgICAgICAgICAgICAgICAgJ3BucG0gaW5zdGFsbCAtLWZyb3plbi1sb2NrZmlsZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kczogWydwbnBtIHR1cmJvIHJ1biBidWlsZCAtLWZpbHRlcj1AcmVwby9mcm9udGVuZCddLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFydGlmYWN0czoge1xuICAgICAgICAgICAgICBiYXNlRGlyZWN0b3J5OiAnZGlzdCcsXG4gICAgICAgICAgICAgIGZpbGVzOiBbJyoqLyonXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWNoZToge1xuICAgICAgICAgICAgICBwYXRoczogWycuLi8uLi9ub2RlX21vZHVsZXMvKiovKicsICcuLi8uLi8udHVyYm8vKiovKiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgYW1wbGlmeUFwcC5hZGRCcmFuY2goJ2RlcGxveS1mcm9udCcpO1xuXG4gIHJldHVybiBhbXBsaWZ5QXBwO1xufVxuIl19