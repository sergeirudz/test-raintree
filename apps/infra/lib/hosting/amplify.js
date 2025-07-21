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
        VITE_GRAPHQL_ENDPOINT: 'https://437vjdrzsbbppihxcxdyn535oi.appsync-api.us-east-1.amazonaws.com/graphql',
        VITE_COGNITO_IDENTITY_POOL_ID: 'us-east-1:fa7c8cb7-4910-416d-99d5-904b7dc8749e',
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
                    appRoot: '.',
                    frontend: {
                        phases: {
                            preBuild: {
                                commands: [
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
                            baseDirectory: 'apps/frontend/dist',
                            files: ['**/*'],
                        },
                        cache: {
                            paths: ['node_modules/**/*', '.turbo/**/*'],
                        },
                    },
                },
            ],
        }),
    });
    amplifyApp.addBranch('main');
    return amplifyApp;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFpQkEsb0RBNERDO0FBN0VELGtFQUlvQztBQUNwQyw2Q0FBMEM7QUFDMUMsNkRBQXNEO0FBV3RELFNBQWdCLG9CQUFvQixDQUNsQyxLQUFnQixFQUNoQixLQUEwQjtJQUUxQixNQUFNLG9CQUFvQixHQUEyQjtRQUNuRCx5QkFBeUIsRUFBRSxlQUFlO1FBQzFDLGFBQWEsRUFBRSxnQkFBZ0I7UUFDL0IsbUJBQW1CLEVBQUUsT0FBTztRQUM1Qix5QkFBeUIsRUFBRSxnQkFBZ0I7UUFDM0MsZUFBZSxFQUFFLFdBQVc7UUFDNUIscUJBQXFCLEVBQ25CLGdGQUFnRjtRQUNsRiw2QkFBNkIsRUFDM0IsZ0RBQWdEO0tBQ25ELENBQUM7SUFFRixNQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7UUFDL0MsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1FBQ2hCLG9CQUFvQjtRQUNwQixRQUFRLEVBQUUsNEJBQVEsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCO1FBQzlDLGtCQUFrQixFQUFFLElBQUksNENBQXdCLENBQUM7WUFDL0MsS0FBSyxFQUFFLFlBQVk7WUFDbkIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsVUFBVSxFQUFFLHlCQUFXLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQztTQUN2RCxDQUFDO1FBQ0Ysa0JBQWtCLEVBQUUsSUFBSTtRQUN4QixTQUFTLEVBQUUseUJBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNwQyxPQUFPLEVBQUUsS0FBSztZQUNkLFlBQVksRUFBRTtnQkFDWjtvQkFDRSxPQUFPLEVBQUUsR0FBRztvQkFDWixRQUFRLEVBQUU7d0JBQ1IsTUFBTSxFQUFFOzRCQUNOLFFBQVEsRUFBRTtnQ0FDUixRQUFRLEVBQUU7b0NBQ1IsaUJBQWlCO29DQUNqQix5Q0FBeUM7b0NBQ3pDLGdDQUFnQztpQ0FDakM7NkJBQ0Y7NEJBQ0QsS0FBSyxFQUFFO2dDQUNMLFFBQVEsRUFBRSxDQUFDLDhDQUE4QyxDQUFDOzZCQUMzRDt5QkFDRjt3QkFDRCxTQUFTLEVBQUU7NEJBQ1QsYUFBYSxFQUFFLG9CQUFvQjs0QkFDbkMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO3lCQUNoQjt3QkFDRCxLQUFLLEVBQUU7NEJBQ0wsS0FBSyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDO3lCQUM1QztxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQztJQUVILFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFN0IsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFwcCxcbiAgR2l0SHViU291cmNlQ29kZVByb3ZpZGVyLFxuICBQbGF0Zm9ybSxcbn0gZnJvbSAnQGF3cy1jZGsvYXdzLWFtcGxpZnktYWxwaGEnO1xuaW1wb3J0IHsgU2VjcmV0VmFsdWUgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBCdWlsZFNwZWMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ29nbml0b0F1dGggfSBmcm9tICcuLi9hdXRoJztcblxudHlwZSBBbXBsaWZ5SG9zdGluZ1Byb3BzID0ge1xuICBhcHBOYW1lOiBzdHJpbmc7XG4gIHJvbGU6IGlhbS5Sb2xlO1xuICBjb2duaXRvQXV0aD86IENvZ25pdG9BdXRoO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFtcGxpZnlIb3N0aW5nKFxuICBzY29wZTogQ29uc3RydWN0LFxuICBwcm9wczogQW1wbGlmeUhvc3RpbmdQcm9wc1xuKSB7XG4gIGNvbnN0IGVudmlyb25tZW50VmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIEFNUExJRllfTU9OT1JFUE9fQVBQX1JPT1Q6ICdhcHBzL2Zyb250ZW5kJyxcbiAgICBfQ1VTVE9NX0lNQUdFOiAnYW1wbGlmeTphbDIwMjMnLFxuICAgIEFNUExJRllfRElGRl9ERVBMT1k6ICdmYWxzZScsXG4gICAgQU1QTElGWV9NT05PUkVQT19BUFBfTkFNRTogJ0ByZXBvL2Zyb250ZW5kJyxcbiAgICBWSVRFX0FXU19SRUdJT046ICd1cy1lYXN0LTEnLFxuICAgIFZJVEVfR1JBUEhRTF9FTkRQT0lOVDpcbiAgICAgICdodHRwczovLzQzN3ZqZHJ6c2JicHBpaHhjeGR5bjUzNW9pLmFwcHN5bmMtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL2dyYXBocWwnLFxuICAgIFZJVEVfQ09HTklUT19JREVOVElUWV9QT09MX0lEOlxuICAgICAgJ3VzLWVhc3QtMTpmYTdjOGNiNy00OTEwLTQxNmQtOTlkNS05MDRiN2RjODc0OWUnLFxuICB9O1xuXG4gIGNvbnN0IGFtcGxpZnlBcHAgPSBuZXcgQXBwKHNjb3BlLCBwcm9wcy5hcHBOYW1lLCB7XG4gICAgcm9sZTogcHJvcHMucm9sZSxcbiAgICBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0uV0VCLCAvLyBXRUJfQ09NUFVURSA9PT0gU1NSXG4gICAgc291cmNlQ29kZVByb3ZpZGVyOiBuZXcgR2l0SHViU291cmNlQ29kZVByb3ZpZGVyKHtcbiAgICAgIG93bmVyOiAnc2VyZ2VpcnVkeicsXG4gICAgICByZXBvc2l0b3J5OiAndGVzdC1yYWludHJlZScsXG4gICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignZ2l0aHViLXRva2VuJyksXG4gICAgfSksXG4gICAgYXV0b0JyYW5jaERlbGV0aW9uOiB0cnVlLFxuICAgIGJ1aWxkU3BlYzogQnVpbGRTcGVjLmZyb21PYmplY3RUb1lhbWwoe1xuICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICBhcHBsaWNhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGFwcFJvb3Q6ICcuJyxcbiAgICAgICAgICBmcm9udGVuZDoge1xuICAgICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICAgIHByZUJ1aWxkOiB7XG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICAgICdjb3JlcGFjayBlbmFibGUnLFxuICAgICAgICAgICAgICAgICAgJ2NvcmVwYWNrIHByZXBhcmUgcG5wbUBsYXRlc3QgLS1hY3RpdmF0ZScsXG4gICAgICAgICAgICAgICAgICAncG5wbSBpbnN0YWxsIC0tZnJvemVuLWxvY2tmaWxlJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBidWlsZDoge1xuICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBbJ3BucG0gdHVyYm8gcnVuIGJ1aWxkIC0tZmlsdGVyPUByZXBvL2Zyb250ZW5kJ10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXJ0aWZhY3RzOiB7XG4gICAgICAgICAgICAgIGJhc2VEaXJlY3Rvcnk6ICdhcHBzL2Zyb250ZW5kL2Rpc3QnLFxuICAgICAgICAgICAgICBmaWxlczogWycqKi8qJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FjaGU6IHtcbiAgICAgICAgICAgICAgcGF0aHM6IFsnbm9kZV9tb2R1bGVzLyoqLyonLCAnLnR1cmJvLyoqLyonXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gIH0pO1xuXG4gIGFtcGxpZnlBcHAuYWRkQnJhbmNoKCdtYWluJyk7XG5cbiAgcmV0dXJuIGFtcGxpZnlBcHA7XG59XG4iXX0=