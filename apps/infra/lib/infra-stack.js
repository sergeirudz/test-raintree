"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfraStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const sns = require("aws-cdk-lib/aws-sns");
const subs = require("aws-cdk-lib/aws-sns-subscriptions");
const sqs = require("aws-cdk-lib/aws-sqs");
const iam = require("aws-cdk-lib/aws-iam");
const createTable_1 = require("./tables/createTable");
const appsync_1 = require("./api/appsync");
const amplify_1 = require("./hosting/amplify");
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
        (0, amplify_1.createAmplifyHosting)(this, {
            appName: amplifyAppName,
            role: amplifyRole,
        });
    }
}
exports.InfraStack = InfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMEQ7QUFDMUQsMkNBQTJDO0FBQzNDLDBEQUEwRDtBQUMxRCwyQ0FBMkM7QUFFM0MsMkNBQTJDO0FBQzNDLHNEQUFtRDtBQUNuRCwyQ0FBaUQ7QUFDakQsK0NBQXlEO0FBRXpELE1BQWEsVUFBVyxTQUFRLG1CQUFLO0lBQ25DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDOUMsaUJBQWlCLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1NBQ3pDLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFaEQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUV2RCxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUM7UUFFbEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDcEQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDO1lBQzVELGVBQWUsRUFBRTtnQkFDZixHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUN4Qyw2QkFBNkIsQ0FDOUI7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLElBQUEseUJBQVcsRUFBQyxJQUFJLEVBQUU7WUFDdEMsU0FBUyxFQUFFLGNBQWM7U0FDMUIsQ0FBQyxDQUFDO1FBRUgsSUFBQSwwQkFBZ0IsRUFBQyxJQUFJLEVBQUU7WUFDckIsT0FBTyxFQUFFLGFBQWE7WUFDdEIsU0FBUyxFQUFFLGFBQWE7U0FDekIsQ0FBQyxDQUFDO1FBRUgsSUFBQSw4QkFBb0IsRUFBQyxJQUFJLEVBQUU7WUFDekIsT0FBTyxFQUFFLGNBQWM7WUFDdkIsSUFBSSxFQUFFLFdBQVc7U0FDbEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBckNELGdDQXFDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IER1cmF0aW9uLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zJztcbmltcG9ydCAqIGFzIHN1YnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucy1zdWJzY3JpcHRpb25zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgY3JlYXRlVGFibGUgfSBmcm9tICcuL3RhYmxlcy9jcmVhdGVUYWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVBcHBTeW5jQVBJIH0gZnJvbSAnLi9hcGkvYXBwc3luYyc7XG5pbXBvcnQgeyBjcmVhdGVBbXBsaWZ5SG9zdGluZyB9IGZyb20gJy4vaG9zdGluZy9hbXBsaWZ5JztcblxuZXhwb3J0IGNsYXNzIEluZnJhU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHRoaXMsICdJbmZyYVF1ZXVlJywge1xuICAgICAgdmlzaWJpbGl0eVRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMzAwKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRvcGljID0gbmV3IHNucy5Ub3BpYyh0aGlzLCAnSW5mcmFUb3BpYycpO1xuXG4gICAgdG9waWMuYWRkU3Vic2NyaXB0aW9uKG5ldyBzdWJzLlNxc1N1YnNjcmlwdGlvbihxdWV1ZSkpO1xuXG4gICAgY29uc3QgYW1wbGlmeUFwcE5hbWUgPSAnRnJvbnRlbmQnO1xuXG4gICAgY29uc3QgYW1wbGlmeVJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0FtcGxpZnlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2FtcGxpZnkuYW1hem9uYXdzLmNvbScpLFxuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgICAgIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShcbiAgICAgICAgICAnQWRtaW5pc3RyYXRvckFjY2Vzcy1BbXBsaWZ5J1xuICAgICAgICApLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGR5bmFtb0RCVGFibGUgPSBjcmVhdGVUYWJsZSh0aGlzLCB7XG4gICAgICB0YWJsZU5hbWU6ICdhcHBEYXRhVGFibGUnLFxuICAgIH0pO1xuXG4gICAgY3JlYXRlQXBwU3luY0FQSSh0aGlzLCB7XG4gICAgICBhcGlOYW1lOiAnd2VpZ2h0cy1hcGknLFxuICAgICAgZGF0YVRhYmxlOiBkeW5hbW9EQlRhYmxlLFxuICAgIH0pO1xuXG4gICAgY3JlYXRlQW1wbGlmeUhvc3RpbmcodGhpcywge1xuICAgICAgYXBwTmFtZTogYW1wbGlmeUFwcE5hbWUsXG4gICAgICByb2xlOiBhbXBsaWZ5Um9sZSxcbiAgICB9KTtcbiAgfVxufVxuIl19