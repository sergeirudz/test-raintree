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
const createCognitoAuth_1 = require("./auth/createCognitoAuth");
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
        // Create Cognito Identity Pool for guest authentication
        const cognitoAuth = (0, createCognitoAuth_1.createCognitoAuth)(this, {
            identityPoolName: 'RaintreeGuestAccess',
        });
        // Grant read-only access to DynamoDB table for unauthenticated users
        cognitoAuth.grantReadOnlyDynamoDBAccess([dynamoDBTable.tableArn]);
        (0, appsync_1.createAppSyncAPI)(this, {
            apiName: 'weights-api',
            dataTable: dynamoDBTable,
            cognitoAuth: cognitoAuth, // Pass Cognito auth to AppSync
        });
        (0, amplify_1.createAmplifyHosting)(this, {
            appName: amplifyAppName,
            role: amplifyRole,
        });
    }
}
exports.InfraStack = InfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMEQ7QUFDMUQsMkNBQTJDO0FBQzNDLDBEQUEwRDtBQUMxRCwyQ0FBMkM7QUFFM0MsMkNBQTJDO0FBQzNDLHNEQUFtRDtBQUNuRCwyQ0FBaUQ7QUFDakQsK0NBQXlEO0FBQ3pELGdFQUE2RDtBQUU3RCxNQUFhLFVBQVcsU0FBUSxtQkFBSztJQUNuQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzlDLGlCQUFpQixFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztTQUN6QyxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRWhELEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFdkQsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDO1FBRWxDLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3BELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQztZQUM1RCxlQUFlLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FDeEMsNkJBQTZCLENBQzlCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWEsR0FBRyxJQUFBLHlCQUFXLEVBQUMsSUFBSSxFQUFFO1lBQ3RDLFNBQVMsRUFBRSxjQUFjO1NBQzFCLENBQUMsQ0FBQztRQUVILHdEQUF3RDtRQUN4RCxNQUFNLFdBQVcsR0FBRyxJQUFBLHFDQUFpQixFQUFDLElBQUksRUFBRTtZQUMxQyxnQkFBZ0IsRUFBRSxxQkFBcUI7U0FDeEMsQ0FBQyxDQUFDO1FBRUgscUVBQXFFO1FBQ3JFLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRWxFLElBQUEsMEJBQWdCLEVBQUMsSUFBSSxFQUFFO1lBQ3JCLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLFdBQVcsRUFBRSxXQUFXLEVBQUUsK0JBQStCO1NBQzFELENBQUMsQ0FBQztRQUVILElBQUEsOEJBQW9CLEVBQUMsSUFBSSxFQUFFO1lBQ3pCLE9BQU8sRUFBRSxjQUFjO1lBQ3ZCLElBQUksRUFBRSxXQUFXO1NBQ2xCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTlDRCxnQ0E4Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBzdWJzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMtc3Vic2NyaXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IGNyZWF0ZVRhYmxlIH0gZnJvbSAnLi90YWJsZXMvY3JlYXRlVGFibGUnO1xuaW1wb3J0IHsgY3JlYXRlQXBwU3luY0FQSSB9IGZyb20gJy4vYXBpL2FwcHN5bmMnO1xuaW1wb3J0IHsgY3JlYXRlQW1wbGlmeUhvc3RpbmcgfSBmcm9tICcuL2hvc3RpbmcvYW1wbGlmeSc7XG5pbXBvcnQgeyBjcmVhdGVDb2duaXRvQXV0aCB9IGZyb20gJy4vYXV0aC9jcmVhdGVDb2duaXRvQXV0aCc7XG5cbmV4cG9ydCBjbGFzcyBJbmZyYVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHF1ZXVlID0gbmV3IHNxcy5RdWV1ZSh0aGlzLCAnSW5mcmFRdWV1ZScsIHtcbiAgICAgIHZpc2liaWxpdHlUaW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwMCksXG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWModGhpcywgJ0luZnJhVG9waWMnKTtcblxuICAgIHRvcGljLmFkZFN1YnNjcmlwdGlvbihuZXcgc3Vicy5TcXNTdWJzY3JpcHRpb24ocXVldWUpKTtcblxuICAgIGNvbnN0IGFtcGxpZnlBcHBOYW1lID0gJ0Zyb250ZW5kJztcblxuICAgIGNvbnN0IGFtcGxpZnlSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdBbXBsaWZ5Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdhbXBsaWZ5LmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW1xuICAgICAgICBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXG4gICAgICAgICAgJ0FkbWluaXN0cmF0b3JBY2Nlc3MtQW1wbGlmeSdcbiAgICAgICAgKSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkeW5hbW9EQlRhYmxlID0gY3JlYXRlVGFibGUodGhpcywge1xuICAgICAgdGFibGVOYW1lOiAnYXBwRGF0YVRhYmxlJyxcbiAgICB9KTtcblxuICAgIC8vIENyZWF0ZSBDb2duaXRvIElkZW50aXR5IFBvb2wgZm9yIGd1ZXN0IGF1dGhlbnRpY2F0aW9uXG4gICAgY29uc3QgY29nbml0b0F1dGggPSBjcmVhdGVDb2duaXRvQXV0aCh0aGlzLCB7XG4gICAgICBpZGVudGl0eVBvb2xOYW1lOiAnUmFpbnRyZWVHdWVzdEFjY2VzcycsXG4gICAgfSk7XG5cbiAgICAvLyBHcmFudCByZWFkLW9ubHkgYWNjZXNzIHRvIER5bmFtb0RCIHRhYmxlIGZvciB1bmF1dGhlbnRpY2F0ZWQgdXNlcnNcbiAgICBjb2duaXRvQXV0aC5ncmFudFJlYWRPbmx5RHluYW1vREJBY2Nlc3MoW2R5bmFtb0RCVGFibGUudGFibGVBcm5dKTtcblxuICAgIGNyZWF0ZUFwcFN5bmNBUEkodGhpcywge1xuICAgICAgYXBpTmFtZTogJ3dlaWdodHMtYXBpJyxcbiAgICAgIGRhdGFUYWJsZTogZHluYW1vREJUYWJsZSxcbiAgICAgIGNvZ25pdG9BdXRoOiBjb2duaXRvQXV0aCwgLy8gUGFzcyBDb2duaXRvIGF1dGggdG8gQXBwU3luY1xuICAgIH0pO1xuXG4gICAgY3JlYXRlQW1wbGlmeUhvc3RpbmcodGhpcywge1xuICAgICAgYXBwTmFtZTogYW1wbGlmeUFwcE5hbWUsXG4gICAgICByb2xlOiBhbXBsaWZ5Um9sZSxcbiAgICB9KTtcbiAgfVxufVxuIl19