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
            AMPLIFY_MONOREPO_APP_ROOT: 'apps/web',
            _CUSTOM_IMAGE: 'amplify:al2023',
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
    return amplifyApp;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFlQSxvREFzREM7QUFyRUQsa0VBSW9DO0FBQ3BDLDZDQUEwQztBQUMxQyw2REFBc0Q7QUFTdEQsU0FBZ0Isb0JBQW9CLENBQ2xDLEtBQWdCLEVBQ2hCLEtBQTBCO0lBRTFCLE1BQU0sVUFBVSxHQUFHLElBQUksdUJBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtRQUMvQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7UUFDaEIsb0JBQW9CLEVBQUU7WUFDcEIseUJBQXlCLEVBQUUsVUFBVTtZQUNyQyxhQUFhLEVBQUUsZ0JBQWdCO1NBQ2hDO1FBQ0QsUUFBUSxFQUFFLDRCQUFRLENBQUMsR0FBRyxFQUFFLHNCQUFzQjtRQUM5QyxrQkFBa0IsRUFBRSxJQUFJLDRDQUF3QixDQUFDO1lBQy9DLEtBQUssRUFBRSxZQUFZO1lBQ25CLFVBQVUsRUFBRSxlQUFlO1lBQzNCLFVBQVUsRUFBRSx5QkFBVyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7U0FDdkQsQ0FBQztRQUNGLGtCQUFrQixFQUFFLElBQUk7UUFDeEIsU0FBUyxFQUFFLHlCQUFTLENBQUMsZ0JBQWdCLENBQUM7WUFDcEMsT0FBTyxFQUFFLEtBQUs7WUFDZCxZQUFZLEVBQUU7Z0JBQ1o7b0JBQ0UsT0FBTyxFQUFFLFVBQVU7b0JBQ25CLFFBQVEsRUFBRTt3QkFDUixNQUFNLEVBQUU7NEJBQ04sUUFBUSxFQUFFO2dDQUNSLFFBQVEsRUFBRTtvQ0FDUixVQUFVO29DQUNWLEtBQUs7b0NBQ0wsUUFBUTtvQ0FDUixpQkFBaUI7b0NBQ2pCLHlDQUF5QztvQ0FDekMsZ0NBQWdDO2lDQUNqQzs2QkFDRjs0QkFDRCxLQUFLLEVBQUU7Z0NBQ0wsUUFBUSxFQUFFLENBQUMseUNBQXlDLENBQUM7NkJBQ3REO3lCQUNGO3dCQUNELFNBQVMsRUFBRTs0QkFDVCxhQUFhLEVBQUUsTUFBTTs0QkFDckIsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO3lCQUNoQjt3QkFDRCxLQUFLLEVBQUU7NEJBQ0wsS0FBSyxFQUFFLENBQUMseUJBQXlCLEVBQUUsbUJBQW1CLENBQUM7eUJBQ3hEO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO0tBQ0gsQ0FBQyxDQUFDO0lBRUgsVUFBVSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUVyQyxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQXBwLFxuICBHaXRIdWJTb3VyY2VDb2RlUHJvdmlkZXIsXG4gIFBsYXRmb3JtLFxufSBmcm9tICdAYXdzLWNkay9hd3MtYW1wbGlmeS1hbHBoYSc7XG5pbXBvcnQgeyBTZWNyZXRWYWx1ZSB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEJ1aWxkU3BlYyB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbnR5cGUgQW1wbGlmeUhvc3RpbmdQcm9wcyA9IHtcbiAgYXBwTmFtZTogc3RyaW5nO1xuICByb2xlOiBpYW0uUm9sZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBbXBsaWZ5SG9zdGluZyhcbiAgc2NvcGU6IENvbnN0cnVjdCxcbiAgcHJvcHM6IEFtcGxpZnlIb3N0aW5nUHJvcHNcbikge1xuICBjb25zdCBhbXBsaWZ5QXBwID0gbmV3IEFwcChzY29wZSwgcHJvcHMuYXBwTmFtZSwge1xuICAgIHJvbGU6IHByb3BzLnJvbGUsXG4gICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgIEFNUExJRllfTU9OT1JFUE9fQVBQX1JPT1Q6ICdhcHBzL3dlYicsXG4gICAgICBfQ1VTVE9NX0lNQUdFOiAnYW1wbGlmeTphbDIwMjMnLFxuICAgIH0sXG4gICAgcGxhdGZvcm06IFBsYXRmb3JtLldFQiwgLy8gV0VCX0NPTVBVVEUgPT09IFNTUlxuICAgIHNvdXJjZUNvZGVQcm92aWRlcjogbmV3IEdpdEh1YlNvdXJjZUNvZGVQcm92aWRlcih7XG4gICAgICBvd25lcjogJ3NlcmdlaXJ1ZHonLFxuICAgICAgcmVwb3NpdG9yeTogJ3Rlc3QtcmFpbnRyZWUnLFxuICAgICAgb2F1dGhUb2tlbjogU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2dpdGh1Yi10b2tlbicpLFxuICAgIH0pLFxuICAgIGF1dG9CcmFuY2hEZWxldGlvbjogdHJ1ZSxcbiAgICBidWlsZFNwZWM6IEJ1aWxkU3BlYy5mcm9tT2JqZWN0VG9ZYW1sKHtcbiAgICAgIHZlcnNpb246ICcxLjAnLFxuICAgICAgYXBwbGljYXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBhcHBSb290OiAnYXBwcy93ZWInLFxuICAgICAgICAgIGZyb250ZW5kOiB7XG4gICAgICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICAgICAgcHJlQnVpbGQ6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgICAgICAgJ2NkIC4uLy4uJyxcbiAgICAgICAgICAgICAgICAgICdwd2QnLFxuICAgICAgICAgICAgICAgICAgJ2xzIC1sYScsXG4gICAgICAgICAgICAgICAgICAnY29yZXBhY2sgZW5hYmxlJyxcbiAgICAgICAgICAgICAgICAgICdjb3JlcGFjayBwcmVwYXJlIHBucG1AbGF0ZXN0IC0tYWN0aXZhdGUnLFxuICAgICAgICAgICAgICAgICAgJ3BucG0gaW5zdGFsbCAtLWZyb3plbi1sb2NrZmlsZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kczogWydwbnBtIHR1cmJvIHJ1biBidWlsZCAtLWZpbHRlcj1AcmVwby93ZWInXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcnRpZmFjdHM6IHtcbiAgICAgICAgICAgICAgYmFzZURpcmVjdG9yeTogJ2Rpc3QnLFxuICAgICAgICAgICAgICBmaWxlczogWycqKi8qJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FjaGU6IHtcbiAgICAgICAgICAgICAgcGF0aHM6IFsnLi4vLi4vbm9kZV9tb2R1bGVzLyoqLyonLCAnLi4vLi4vLnR1cmJvLyoqLyonXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gIH0pO1xuXG4gIGFtcGxpZnlBcHAuYWRkQnJhbmNoKCdkZXBsb3ktZnJvbnQnKTtcblxuICByZXR1cm4gYW1wbGlmeUFwcDtcbn1cbiJdfQ==