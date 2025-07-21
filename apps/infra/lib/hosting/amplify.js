"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAmplifyHosting = createAmplifyHosting;
const aws_amplify_alpha_1 = require("@aws-cdk/aws-amplify-alpha");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_codebuild_1 = require("aws-cdk-lib/aws-codebuild");
function createAmplifyHosting(scope, props) {
    const environmentVariables = {
        AMPLIFY_MONOREPO_APP_ROOT: 'apps/frontend',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFpQkEsb0RBaUVDO0FBbEZELGtFQUlvQztBQUNwQyw2Q0FBMEM7QUFDMUMsNkRBQXNEO0FBV3RELFNBQWdCLG9CQUFvQixDQUNsQyxLQUFnQixFQUNoQixLQUEwQjtJQUUxQixNQUFNLG9CQUFvQixHQUEyQjtRQUNuRCx5QkFBeUIsRUFBRSxlQUFlO1FBQzFDLGVBQWUsRUFBRSxXQUFXO1FBQzVCLHFCQUFxQixFQUNuQixnRkFBZ0Y7UUFDbEYsNkJBQTZCLEVBQzNCLGdEQUFnRDtLQUNuRCxDQUFDO0lBRUYsTUFBTSxVQUFVLEdBQUcsSUFBSSx1QkFBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQy9DLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtRQUNoQixvQkFBb0I7UUFDcEIsUUFBUSxFQUFFLDRCQUFRLENBQUMsR0FBRyxFQUFFLHNCQUFzQjtRQUM5QyxrQkFBa0IsRUFBRSxJQUFJLDRDQUF3QixDQUFDO1lBQy9DLEtBQUssRUFBRSxZQUFZO1lBQ25CLFVBQVUsRUFBRSxlQUFlO1lBQzNCLFVBQVUsRUFBRSx5QkFBVyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUM7U0FDdkQsQ0FBQztRQUNGLGtCQUFrQixFQUFFLElBQUk7UUFDeEIsU0FBUyxFQUFFLHlCQUFTLENBQUMsZ0JBQWdCLENBQUM7WUFDcEMsT0FBTyxFQUFFLEtBQUs7WUFDZCxZQUFZLEVBQUU7Z0JBQ1o7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFFBQVEsRUFBRTt3QkFDUixNQUFNLEVBQUU7NEJBQ04sUUFBUSxFQUFFO2dDQUNSLFFBQVEsRUFBRTtvQ0FDUixVQUFVO29DQUNWLEtBQUs7b0NBQ0wsUUFBUTtvQ0FDUixzQkFBc0I7b0NBQ3RCLGdCQUFnQjtvQ0FDaEIscUJBQXFCO29DQUNyQixlQUFlO29DQUNmLDRCQUE0QjtvQ0FDNUIsZ0JBQWdCO29DQUNoQixnQ0FBZ0M7b0NBQ2hDLDRDQUE0QztpQ0FDN0M7NkJBQ0Y7NEJBQ0QsS0FBSyxFQUFFO2dDQUNMLFFBQVEsRUFBRSxDQUFDLDhDQUE4QyxDQUFDOzZCQUMzRDt5QkFDRjt3QkFDRCxTQUFTLEVBQUU7NEJBQ1QsYUFBYSxFQUFFLE1BQU07NEJBQ3JCLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQzt5QkFDaEI7d0JBQ0QsS0FBSyxFQUFFOzRCQUNMLEtBQUssRUFBRSxDQUFDLHlCQUF5QixFQUFFLG1CQUFtQixDQUFDO3lCQUN4RDtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQztJQUVILFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFN0IsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFwcCxcbiAgR2l0SHViU291cmNlQ29kZVByb3ZpZGVyLFxuICBQbGF0Zm9ybSxcbn0gZnJvbSAnQGF3cy1jZGsvYXdzLWFtcGxpZnktYWxwaGEnO1xuaW1wb3J0IHsgU2VjcmV0VmFsdWUgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBCdWlsZFNwZWMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ29nbml0b0F1dGggfSBmcm9tICcuLi9hdXRoJztcblxudHlwZSBBbXBsaWZ5SG9zdGluZ1Byb3BzID0ge1xuICBhcHBOYW1lOiBzdHJpbmc7XG4gIHJvbGU6IGlhbS5Sb2xlO1xuICBjb2duaXRvQXV0aD86IENvZ25pdG9BdXRoO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFtcGxpZnlIb3N0aW5nKFxuICBzY29wZTogQ29uc3RydWN0LFxuICBwcm9wczogQW1wbGlmeUhvc3RpbmdQcm9wc1xuKSB7XG4gIGNvbnN0IGVudmlyb25tZW50VmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIEFNUExJRllfTU9OT1JFUE9fQVBQX1JPT1Q6ICdhcHBzL2Zyb250ZW5kJyxcbiAgICBWSVRFX0FXU19SRUdJT046ICd1cy1lYXN0LTEnLFxuICAgIFZJVEVfR1JBUEhRTF9FTkRQT0lOVDpcbiAgICAgICdodHRwczovLzQzN3ZqZHJ6c2JicHBpaHhjeGR5bjUzNW9pLmFwcHN5bmMtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL2dyYXBocWwnLFxuICAgIFZJVEVfQ09HTklUT19JREVOVElUWV9QT09MX0lEOlxuICAgICAgJ3VzLWVhc3QtMTpmYTdjOGNiNy00OTEwLTQxNmQtOTlkNS05MDRiN2RjODc0OWUnLFxuICB9O1xuXG4gIGNvbnN0IGFtcGxpZnlBcHAgPSBuZXcgQXBwKHNjb3BlLCBwcm9wcy5hcHBOYW1lLCB7XG4gICAgcm9sZTogcHJvcHMucm9sZSxcbiAgICBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0uV0VCLCAvLyBXRUJfQ09NUFVURSA9PT0gU1NSXG4gICAgc291cmNlQ29kZVByb3ZpZGVyOiBuZXcgR2l0SHViU291cmNlQ29kZVByb3ZpZGVyKHtcbiAgICAgIG93bmVyOiAnc2VyZ2VpcnVkeicsXG4gICAgICByZXBvc2l0b3J5OiAndGVzdC1yYWludHJlZScsXG4gICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignZ2l0aHViLXRva2VuJyksXG4gICAgfSksXG4gICAgYXV0b0JyYW5jaERlbGV0aW9uOiB0cnVlLFxuICAgIGJ1aWxkU3BlYzogQnVpbGRTcGVjLmZyb21PYmplY3RUb1lhbWwoe1xuICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICBhcHBsaWNhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGFwcFJvb3Q6ICdhcHBzL2Zyb250ZW5kJyxcbiAgICAgICAgICBmcm9udGVuZDoge1xuICAgICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICAgIHByZUJ1aWxkOiB7XG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICAgICdjZCAuLi8uLicsXG4gICAgICAgICAgICAgICAgICAncHdkJyxcbiAgICAgICAgICAgICAgICAgICdscyAtbGEnLFxuICAgICAgICAgICAgICAgICAgJ2VjaG8gXCJOb2RlIHZlcnNpb246XCInLFxuICAgICAgICAgICAgICAgICAgJ25vZGUgLS12ZXJzaW9uJyxcbiAgICAgICAgICAgICAgICAgICdlY2hvIFwiTlBNIHZlcnNpb246XCInLFxuICAgICAgICAgICAgICAgICAgJ25wbSAtLXZlcnNpb24nLFxuICAgICAgICAgICAgICAgICAgJ25wbSBpbnN0YWxsIC1nIHBucG1AbGF0ZXN0JyxcbiAgICAgICAgICAgICAgICAgICdwbnBtIC0tdmVyc2lvbicsXG4gICAgICAgICAgICAgICAgICAncG5wbSBpbnN0YWxsIC0tZnJvemVuLWxvY2tmaWxlJyxcbiAgICAgICAgICAgICAgICAgICdlY2hvIFwiRGVwZW5kZW5jaWVzIGluc3RhbGxlZCBzdWNjZXNzZnVsbHlcIicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kczogWydwbnBtIHR1cmJvIHJ1biBidWlsZCAtLWZpbHRlcj1AcmVwby9mcm9udGVuZCddLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFydGlmYWN0czoge1xuICAgICAgICAgICAgICBiYXNlRGlyZWN0b3J5OiAnZGlzdCcsXG4gICAgICAgICAgICAgIGZpbGVzOiBbJyoqLyonXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWNoZToge1xuICAgICAgICAgICAgICBwYXRoczogWycuLi8uLi9ub2RlX21vZHVsZXMvKiovKicsICcuLi8uLi8udHVyYm8vKiovKiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgYW1wbGlmeUFwcC5hZGRCcmFuY2goJ21haW4nKTtcblxuICByZXR1cm4gYW1wbGlmeUFwcDtcbn1cbiJdfQ==