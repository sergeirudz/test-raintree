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
        AMPLIFY_DIFF_DEPLOY: 'false',
        AMPLIFY_MONOREPO_APP_NAME: '@repo/frontend',
        VITE_AWS_REGION: 'us-east-1',
        VITE_GRAPHQL_ENDPOINT: 'https://pfrgqs7h6jhijh3mhdj75a4u3e.appsync-api.us-east-1.amazonaws.com/graphql',
        VITE_COGNITO_IDENTITY_POOL_ID: 'us-east-1:c2538c3b-1c4f-42df-a1b6-fb71ee8150c0',
    };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFpQkEsb0RBNkRDO0FBOUVELGtFQUlvQztBQUNwQyw2Q0FBMEM7QUFDMUMsNkRBQXNEO0FBV3RELFNBQWdCLG9CQUFvQixDQUNsQyxLQUFnQixFQUNoQixLQUEwQjtJQUUxQixNQUFNLG9CQUFvQixHQUEyQjtRQUNuRCx5QkFBeUIsRUFBRSxlQUFlO1FBQzFDLGFBQWEsRUFBRSxnQkFBZ0I7UUFDL0IsbUJBQW1CLEVBQUUsT0FBTztRQUM1Qix5QkFBeUIsRUFBRSxnQkFBZ0I7UUFDM0MsZUFBZSxFQUFFLFdBQVc7UUFDNUIscUJBQXFCLEVBQ25CLGdGQUFnRjtRQUNsRiw2QkFBNkIsRUFDM0IsZ0RBQWdEO0tBQ25ELENBQUM7SUFFRixNQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7UUFDL0MsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1FBQ2hCLG9CQUFvQjtRQUNwQixRQUFRLEVBQUUsNEJBQVEsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCO1FBQzlDLGtCQUFrQixFQUFFLElBQUksNENBQXdCLENBQUM7WUFDL0MsS0FBSyxFQUFFLFlBQVk7WUFDbkIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsVUFBVSxFQUFFLHlCQUFXLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQztTQUN2RCxDQUFDO1FBQ0Ysa0JBQWtCLEVBQUUsSUFBSTtRQUN4QixTQUFTLEVBQUUseUJBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNwQyxPQUFPLEVBQUUsS0FBSztZQUNkLFlBQVksRUFBRTtnQkFDWjtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDTixRQUFRLEVBQUU7Z0NBQ1IsUUFBUSxFQUFFO29DQUNSLFVBQVU7b0NBQ1YsaUJBQWlCO29DQUNqQix5Q0FBeUM7b0NBQ3pDLGdDQUFnQztpQ0FDakM7NkJBQ0Y7NEJBQ0QsS0FBSyxFQUFFO2dDQUNMLFFBQVEsRUFBRSxDQUFDLDhDQUE4QyxDQUFDOzZCQUMzRDt5QkFDRjt3QkFDRCxTQUFTLEVBQUU7NEJBQ1QsYUFBYSxFQUFFLE1BQU07NEJBQ3JCLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQzt5QkFDaEI7d0JBQ0QsS0FBSyxFQUFFOzRCQUNMLEtBQUssRUFBRSxDQUFDLHlCQUF5QixFQUFFLG1CQUFtQixDQUFDO3lCQUN4RDtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQztJQUVILFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFN0IsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFwcCxcbiAgR2l0SHViU291cmNlQ29kZVByb3ZpZGVyLFxuICBQbGF0Zm9ybSxcbn0gZnJvbSAnQGF3cy1jZGsvYXdzLWFtcGxpZnktYWxwaGEnO1xuaW1wb3J0IHsgU2VjcmV0VmFsdWUgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBCdWlsZFNwZWMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ29nbml0b0F1dGggfSBmcm9tICcuLi9hdXRoJztcblxudHlwZSBBbXBsaWZ5SG9zdGluZ1Byb3BzID0ge1xuICBhcHBOYW1lOiBzdHJpbmc7XG4gIHJvbGU6IGlhbS5Sb2xlO1xuICBjb2duaXRvQXV0aD86IENvZ25pdG9BdXRoO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFtcGxpZnlIb3N0aW5nKFxuICBzY29wZTogQ29uc3RydWN0LFxuICBwcm9wczogQW1wbGlmeUhvc3RpbmdQcm9wc1xuKSB7XG4gIGNvbnN0IGVudmlyb25tZW50VmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIEFNUExJRllfTU9OT1JFUE9fQVBQX1JPT1Q6ICdhcHBzL2Zyb250ZW5kJyxcbiAgICBfQ1VTVE9NX0lNQUdFOiAnYW1wbGlmeTphbDIwMjMnLFxuICAgIEFNUExJRllfRElGRl9ERVBMT1k6ICdmYWxzZScsXG4gICAgQU1QTElGWV9NT05PUkVQT19BUFBfTkFNRTogJ0ByZXBvL2Zyb250ZW5kJyxcbiAgICBWSVRFX0FXU19SRUdJT046ICd1cy1lYXN0LTEnLFxuICAgIFZJVEVfR1JBUEhRTF9FTkRQT0lOVDpcbiAgICAgICdodHRwczovL3BmcmdxczdoNmpoaWpoM21oZGo3NWE0dTNlLmFwcHN5bmMtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL2dyYXBocWwnLFxuICAgIFZJVEVfQ09HTklUT19JREVOVElUWV9QT09MX0lEOlxuICAgICAgJ3VzLWVhc3QtMTpjMjUzOGMzYi0xYzRmLTQyZGYtYTFiNi1mYjcxZWU4MTUwYzAnLFxuICB9O1xuXG4gIGNvbnN0IGFtcGxpZnlBcHAgPSBuZXcgQXBwKHNjb3BlLCBwcm9wcy5hcHBOYW1lLCB7XG4gICAgcm9sZTogcHJvcHMucm9sZSxcbiAgICBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0uV0VCLCAvLyBXRUJfQ09NUFVURSA9PT0gU1NSXG4gICAgc291cmNlQ29kZVByb3ZpZGVyOiBuZXcgR2l0SHViU291cmNlQ29kZVByb3ZpZGVyKHtcbiAgICAgIG93bmVyOiAnc2VyZ2VpcnVkeicsXG4gICAgICByZXBvc2l0b3J5OiAndGVzdC1yYWludHJlZScsXG4gICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignZ2l0aHViLXRva2VuJyksXG4gICAgfSksXG4gICAgYXV0b0JyYW5jaERlbGV0aW9uOiB0cnVlLFxuICAgIGJ1aWxkU3BlYzogQnVpbGRTcGVjLmZyb21PYmplY3RUb1lhbWwoe1xuICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICBhcHBsaWNhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGFwcFJvb3Q6ICdhcHBzL2Zyb250ZW5kJyxcbiAgICAgICAgICBmcm9udGVuZDoge1xuICAgICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICAgIHByZUJ1aWxkOiB7XG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICAgICdjZCAuLi8uLicsXG4gICAgICAgICAgICAgICAgICAnY29yZXBhY2sgZW5hYmxlJyxcbiAgICAgICAgICAgICAgICAgICdjb3JlcGFjayBwcmVwYXJlIHBucG1AbGF0ZXN0IC0tYWN0aXZhdGUnLFxuICAgICAgICAgICAgICAgICAgJ3BucG0gaW5zdGFsbCAtLWZyb3plbi1sb2NrZmlsZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kczogWydwbnBtIHR1cmJvIHJ1biBidWlsZCAtLWZpbHRlcj1AcmVwby9mcm9udGVuZCddLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFydGlmYWN0czoge1xuICAgICAgICAgICAgICBiYXNlRGlyZWN0b3J5OiAnZGlzdCcsXG4gICAgICAgICAgICAgIGZpbGVzOiBbJyoqLyonXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWNoZToge1xuICAgICAgICAgICAgICBwYXRoczogWycuLi8uLi9ub2RlX21vZHVsZXMvKiovKicsICcuLi8uLi8udHVyYm8vKiovKiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgYW1wbGlmeUFwcC5hZGRCcmFuY2goJ21haW4nKTtcblxuICByZXR1cm4gYW1wbGlmeUFwcDtcbn1cbiJdfQ==