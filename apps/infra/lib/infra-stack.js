"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfraStack = void 0;
const aws_amplify_alpha_1 = require("@aws-cdk/aws-amplify-alpha");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_codebuild_1 = require("aws-cdk-lib/aws-codebuild");
const sns = require("aws-cdk-lib/aws-sns");
const subs = require("aws-cdk-lib/aws-sns-subscriptions");
const sqs = require("aws-cdk-lib/aws-sqs");
const iam = require("aws-cdk-lib/aws-iam");
const createTable_1 = require("./tables/createTable");
const appsync_1 = require("./api/appsync");
class InfraStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const queue = new sqs.Queue(this, 'InfraQueue', {
            visibilityTimeout: aws_cdk_lib_1.Duration.seconds(300),
        });
        const topic = new sns.Topic(this, 'InfraTopic');
        topic.addSubscription(new subs.SqsSubscription(queue));
        const amplifyAppName = 'Frontend';
        const amplifyRole = new iam.Role(this, 'AmplifyRole', {
            assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess-Amplify'),
            ],
        });
        const dynamoDBTable = (0, createTable_1.createTable)(this, {
            tableName: 'appDataTable',
        });
        (0, appsync_1.createAppSyncAPI)(this, {
            apiName: 'weights-api',
            dataTable: dynamoDBTable,
        });
        // TODO: Extract to separate file
        const amplifyApp = new aws_amplify_alpha_1.App(this, amplifyAppName, {
            role: amplifyRole,
            environmentVariables: {
                AMPLIFY_MONOREPO_APP_ROOT: 'apps/web',
                _CUSTOM_IMAGE: 'amplify:al2023',
            },
            sourceCodeProvider: new aws_amplify_alpha_1.GitHubSourceCodeProvider({
                owner: 'sergeirudz',
                repository: 'test-raintree',
                oauthToken: aws_cdk_lib_1.SecretValue.secretsManager('github-token'),
            }),
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
    }
}
exports.InfraStack = InfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrRUFBMkU7QUFDM0UsNkNBQXVFO0FBQ3ZFLDZEQUFzRDtBQUN0RCwyQ0FBMkM7QUFDM0MsMERBQTBEO0FBQzFELDJDQUEyQztBQUUzQywyQ0FBMkM7QUFDM0Msc0RBQW1EO0FBQ25ELDJDQUFpRDtBQUVqRCxNQUFhLFVBQVcsU0FBUSxtQkFBSztJQUNuQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzlDLGlCQUFpQixFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztTQUN6QyxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRWhELEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFdkQsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDO1FBRWxDLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3BELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQztZQUM1RCxlQUFlLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FDeEMsNkJBQTZCLENBQzlCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWEsR0FBRyxJQUFBLHlCQUFXLEVBQUMsSUFBSSxFQUFFO1lBQ3RDLFNBQVMsRUFBRSxjQUFjO1NBQzFCLENBQUMsQ0FBQztRQUVILElBQUEsMEJBQWdCLEVBQUMsSUFBSSxFQUFFO1lBQ3JCLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLFNBQVMsRUFBRSxhQUFhO1NBQ3pCLENBQUMsQ0FBQztRQUVILGlDQUFpQztRQUNqQyxNQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFHLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUMvQyxJQUFJLEVBQUUsV0FBVztZQUNqQixvQkFBb0IsRUFBRTtnQkFDcEIseUJBQXlCLEVBQUUsVUFBVTtnQkFDckMsYUFBYSxFQUFFLGdCQUFnQjthQUNoQztZQUNELGtCQUFrQixFQUFFLElBQUksNENBQXdCLENBQUM7Z0JBQy9DLEtBQUssRUFBRSxZQUFZO2dCQUNuQixVQUFVLEVBQUUsZUFBZTtnQkFDM0IsVUFBVSxFQUFFLHlCQUFXLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQzthQUN2RCxDQUFDO1lBQ0YsU0FBUyxFQUFFLHlCQUFTLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ3BDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFlBQVksRUFBRTtvQkFDWjt3QkFDRSxPQUFPLEVBQUUsVUFBVTt3QkFDbkIsUUFBUSxFQUFFOzRCQUNSLE1BQU0sRUFBRTtnQ0FDTixRQUFRLEVBQUU7b0NBQ1IsUUFBUSxFQUFFO3dDQUNSLFVBQVU7d0NBQ1YsS0FBSzt3Q0FDTCxRQUFRO3dDQUNSLGlCQUFpQjt3Q0FDakIseUNBQXlDO3dDQUN6QyxnQ0FBZ0M7cUNBQ2pDO2lDQUNGO2dDQUNELEtBQUssRUFBRTtvQ0FDTCxRQUFRLEVBQUUsQ0FBQyx5Q0FBeUMsQ0FBQztpQ0FDdEQ7NkJBQ0Y7NEJBQ0QsU0FBUyxFQUFFO2dDQUNULGFBQWEsRUFBRSxNQUFNO2dDQUNyQixLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7NkJBQ2hCOzRCQUNELEtBQUssRUFBRTtnQ0FDTCxLQUFLLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxtQkFBbUIsQ0FBQzs2QkFDeEQ7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBQ0gsVUFBVSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0Y7QUEvRUQsZ0NBK0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBHaXRIdWJTb3VyY2VDb2RlUHJvdmlkZXIgfSBmcm9tICdAYXdzLWNkay9hd3MtYW1wbGlmeS1hbHBoYSc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU2VjcmV0VmFsdWUsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQnVpbGRTcGVjIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBzdWJzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMtc3Vic2NyaXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IGNyZWF0ZVRhYmxlIH0gZnJvbSAnLi90YWJsZXMvY3JlYXRlVGFibGUnO1xuaW1wb3J0IHsgY3JlYXRlQXBwU3luY0FQSSB9IGZyb20gJy4vYXBpL2FwcHN5bmMnO1xuXG5leHBvcnQgY2xhc3MgSW5mcmFTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ0luZnJhUXVldWUnLCB7XG4gICAgICB2aXNpYmlsaXR5VGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzMDApLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHRoaXMsICdJbmZyYVRvcGljJyk7XG5cbiAgICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuU3FzU3Vic2NyaXB0aW9uKHF1ZXVlKSk7XG5cbiAgICBjb25zdCBhbXBsaWZ5QXBwTmFtZSA9ICdGcm9udGVuZCc7XG5cbiAgICBjb25zdCBhbXBsaWZ5Um9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQW1wbGlmeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYW1wbGlmeS5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKFxuICAgICAgICAgICdBZG1pbmlzdHJhdG9yQWNjZXNzLUFtcGxpZnknXG4gICAgICAgICksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZHluYW1vREJUYWJsZSA9IGNyZWF0ZVRhYmxlKHRoaXMsIHtcbiAgICAgIHRhYmxlTmFtZTogJ2FwcERhdGFUYWJsZScsXG4gICAgfSk7XG5cbiAgICBjcmVhdGVBcHBTeW5jQVBJKHRoaXMsIHtcbiAgICAgIGFwaU5hbWU6ICd3ZWlnaHRzLWFwaScsXG4gICAgICBkYXRhVGFibGU6IGR5bmFtb0RCVGFibGUsXG4gICAgfSk7XG5cbiAgICAvLyBUT0RPOiBFeHRyYWN0IHRvIHNlcGFyYXRlIGZpbGVcbiAgICBjb25zdCBhbXBsaWZ5QXBwID0gbmV3IEFwcCh0aGlzLCBhbXBsaWZ5QXBwTmFtZSwge1xuICAgICAgcm9sZTogYW1wbGlmeVJvbGUsXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICBBTVBMSUZZX01PTk9SRVBPX0FQUF9ST09UOiAnYXBwcy93ZWInLFxuICAgICAgICBfQ1VTVE9NX0lNQUdFOiAnYW1wbGlmeTphbDIwMjMnLFxuICAgICAgfSxcbiAgICAgIHNvdXJjZUNvZGVQcm92aWRlcjogbmV3IEdpdEh1YlNvdXJjZUNvZGVQcm92aWRlcih7XG4gICAgICAgIG93bmVyOiAnc2VyZ2VpcnVkeicsXG4gICAgICAgIHJlcG9zaXRvcnk6ICd0ZXN0LXJhaW50cmVlJyxcbiAgICAgICAgb2F1dGhUb2tlbjogU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2dpdGh1Yi10b2tlbicpLFxuICAgICAgfSksXG4gICAgICBidWlsZFNwZWM6IEJ1aWxkU3BlYy5mcm9tT2JqZWN0VG9ZYW1sKHtcbiAgICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICAgIGFwcGxpY2F0aW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGFwcFJvb3Q6ICdhcHBzL3dlYicsXG4gICAgICAgICAgICBmcm9udGVuZDoge1xuICAgICAgICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICAgICAgICBwcmVCdWlsZDoge1xuICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2NkIC4uLy4uJyxcbiAgICAgICAgICAgICAgICAgICAgJ3B3ZCcsXG4gICAgICAgICAgICAgICAgICAgICdscyAtbGEnLFxuICAgICAgICAgICAgICAgICAgICAnY29yZXBhY2sgZW5hYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgJ2NvcmVwYWNrIHByZXBhcmUgcG5wbUBsYXRlc3QgLS1hY3RpdmF0ZScsXG4gICAgICAgICAgICAgICAgICAgICdwbnBtIGluc3RhbGwgLS1mcm96ZW4tbG9ja2ZpbGUnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJ1aWxkOiB7XG4gICAgICAgICAgICAgICAgICBjb21tYW5kczogWydwbnBtIHR1cmJvIHJ1biBidWlsZCAtLWZpbHRlcj1AcmVwby93ZWInXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcbiAgICAgICAgICAgICAgICBiYXNlRGlyZWN0b3J5OiAnZGlzdCcsXG4gICAgICAgICAgICAgICAgZmlsZXM6IFsnKiovKiddLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWNoZToge1xuICAgICAgICAgICAgICAgIHBhdGhzOiBbJy4uLy4uL25vZGVfbW9kdWxlcy8qKi8qJywgJy4uLy4uLy50dXJiby8qKi8qJ10sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgICBhbXBsaWZ5QXBwLmFkZEJyYW5jaCgnZGVwbG95LWZyb250Jyk7XG4gIH1cbn1cbiJdfQ==