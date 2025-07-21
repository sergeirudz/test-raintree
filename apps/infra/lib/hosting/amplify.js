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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFpQkEsb0RBNkRDO0FBOUVELGtFQUlvQztBQUNwQyw2Q0FBMEM7QUFDMUMsNkRBQXNEO0FBV3RELFNBQWdCLG9CQUFvQixDQUNsQyxLQUFnQixFQUNoQixLQUEwQjtJQUUxQixNQUFNLG9CQUFvQixHQUEyQjtRQUNuRCx5QkFBeUIsRUFBRSxlQUFlO1FBQzFDLGFBQWEsRUFBRSxnQkFBZ0I7UUFDL0IsZUFBZSxFQUFFLFdBQVc7UUFDNUIscUJBQXFCLEVBQ25CLGdGQUFnRjtRQUNsRiw2QkFBNkIsRUFDM0IsZ0RBQWdEO0tBQ25ELENBQUM7SUFFRixNQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7UUFDL0MsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1FBQ2hCLG9CQUFvQjtRQUNwQixRQUFRLEVBQUUsNEJBQVEsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCO1FBQzlDLGtCQUFrQixFQUFFLElBQUksNENBQXdCLENBQUM7WUFDL0MsS0FBSyxFQUFFLFlBQVk7WUFDbkIsVUFBVSxFQUFFLGVBQWU7WUFDM0IsVUFBVSxFQUFFLHlCQUFXLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQztTQUN2RCxDQUFDO1FBQ0Ysa0JBQWtCLEVBQUUsSUFBSTtRQUN4QixTQUFTLEVBQUUseUJBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNwQyxPQUFPLEVBQUUsS0FBSztZQUNkLFlBQVksRUFBRTtnQkFDWjtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRTs0QkFDTixRQUFRLEVBQUU7Z0NBQ1IsUUFBUSxFQUFFO29DQUNSLFVBQVU7b0NBQ1YsS0FBSztvQ0FDTCxRQUFRO29DQUNSLGlCQUFpQjtvQ0FDakIseUNBQXlDO29DQUN6QyxnQ0FBZ0M7aUNBQ2pDOzZCQUNGOzRCQUNELEtBQUssRUFBRTtnQ0FDTCxRQUFRLEVBQUUsQ0FBQyw4Q0FBOEMsQ0FBQzs2QkFDM0Q7eUJBQ0Y7d0JBQ0QsU0FBUyxFQUFFOzRCQUNULGFBQWEsRUFBRSxNQUFNOzRCQUNyQixLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7eUJBQ2hCO3dCQUNELEtBQUssRUFBRTs0QkFDTCxLQUFLLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxtQkFBbUIsQ0FBQzt5QkFDeEQ7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUM7S0FDSCxDQUFDLENBQUM7SUFFSCxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTdCLE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBcHAsXG4gIEdpdEh1YlNvdXJjZUNvZGVQcm92aWRlcixcbiAgUGxhdGZvcm0sXG59IGZyb20gJ0Bhd3MtY2RrL2F3cy1hbXBsaWZ5LWFscGhhJztcbmltcG9ydCB7IFNlY3JldFZhbHVlIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQnVpbGRTcGVjIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvZ25pdG9BdXRoIH0gZnJvbSAnLi4vYXV0aCc7XG5cbnR5cGUgQW1wbGlmeUhvc3RpbmdQcm9wcyA9IHtcbiAgYXBwTmFtZTogc3RyaW5nO1xuICByb2xlOiBpYW0uUm9sZTtcbiAgY29nbml0b0F1dGg/OiBDb2duaXRvQXV0aDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBbXBsaWZ5SG9zdGluZyhcbiAgc2NvcGU6IENvbnN0cnVjdCxcbiAgcHJvcHM6IEFtcGxpZnlIb3N0aW5nUHJvcHNcbikge1xuICBjb25zdCBlbnZpcm9ubWVudFZhcmlhYmxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBBTVBMSUZZX01PTk9SRVBPX0FQUF9ST09UOiAnYXBwcy9mcm9udGVuZCcsXG4gICAgX0NVU1RPTV9JTUFHRTogJ2FtcGxpZnk6YWwyMDIzJyxcbiAgICBWSVRFX0FXU19SRUdJT046ICd1cy1lYXN0LTEnLFxuICAgIFZJVEVfR1JBUEhRTF9FTkRQT0lOVDpcbiAgICAgICdodHRwczovLzQzN3ZqZHJ6c2JicHBpaHhjeGR5bjUzNW9pLmFwcHN5bmMtYXBpLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL2dyYXBocWwnLFxuICAgIFZJVEVfQ09HTklUT19JREVOVElUWV9QT09MX0lEOlxuICAgICAgJ3VzLWVhc3QtMTpmYTdjOGNiNy00OTEwLTQxNmQtOTlkNS05MDRiN2RjODc0OWUnLFxuICB9O1xuXG4gIGNvbnN0IGFtcGxpZnlBcHAgPSBuZXcgQXBwKHNjb3BlLCBwcm9wcy5hcHBOYW1lLCB7XG4gICAgcm9sZTogcHJvcHMucm9sZSxcbiAgICBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0uV0VCLCAvLyBXRUJfQ09NUFVURSA9PT0gU1NSXG4gICAgc291cmNlQ29kZVByb3ZpZGVyOiBuZXcgR2l0SHViU291cmNlQ29kZVByb3ZpZGVyKHtcbiAgICAgIG93bmVyOiAnc2VyZ2VpcnVkeicsXG4gICAgICByZXBvc2l0b3J5OiAndGVzdC1yYWludHJlZScsXG4gICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignZ2l0aHViLXRva2VuJyksXG4gICAgfSksXG4gICAgYXV0b0JyYW5jaERlbGV0aW9uOiB0cnVlLFxuICAgIGJ1aWxkU3BlYzogQnVpbGRTcGVjLmZyb21PYmplY3RUb1lhbWwoe1xuICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICBhcHBsaWNhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGFwcFJvb3Q6ICdhcHBzL2Zyb250ZW5kJyxcbiAgICAgICAgICBmcm9udGVuZDoge1xuICAgICAgICAgICAgcGhhc2VzOiB7XG4gICAgICAgICAgICAgIHByZUJ1aWxkOiB7XG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICAgICdjZCAuLi8uLicsXG4gICAgICAgICAgICAgICAgICAncHdkJyxcbiAgICAgICAgICAgICAgICAgICdscyAtbGEnLFxuICAgICAgICAgICAgICAgICAgJ2NvcmVwYWNrIGVuYWJsZScsXG4gICAgICAgICAgICAgICAgICAnY29yZXBhY2sgcHJlcGFyZSBwbnBtQGxhdGVzdCAtLWFjdGl2YXRlJyxcbiAgICAgICAgICAgICAgICAgICdwbnBtIGluc3RhbGwgLS1mcm96ZW4tbG9ja2ZpbGUnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICAgICAgY29tbWFuZHM6IFsncG5wbSB0dXJibyBydW4gYnVpbGQgLS1maWx0ZXI9QHJlcG8vZnJvbnRlbmQnXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhcnRpZmFjdHM6IHtcbiAgICAgICAgICAgICAgYmFzZURpcmVjdG9yeTogJ2Rpc3QnLFxuICAgICAgICAgICAgICBmaWxlczogWycqKi8qJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FjaGU6IHtcbiAgICAgICAgICAgICAgcGF0aHM6IFsnLi4vLi4vbm9kZV9tb2R1bGVzLyoqLyonLCAnLi4vLi4vLnR1cmJvLyoqLyonXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gIH0pO1xuXG4gIGFtcGxpZnlBcHAuYWRkQnJhbmNoKCdtYWluJyk7XG5cbiAgcmV0dXJuIGFtcGxpZnlBcHA7XG59XG4iXX0=