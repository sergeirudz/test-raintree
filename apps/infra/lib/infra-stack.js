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
        const cognitoAuth = (0, createCognitoAuth_1.createCognitoAuth)(this, {
            identityPoolName: 'RaintreeGuestAccess',
        });
        cognitoAuth.grantFullDynamoDBAccess([dynamoDBTable.tableArn]);
        (0, appsync_1.createAppSyncAPI)(this, {
            apiName: 'weights-api',
            dataTable: dynamoDBTable,
            cognitoAuth: cognitoAuth, // Pass Cognito auth to AppSync
        });
        (0, amplify_1.createAmplifyHosting)(this, {
            appName: amplifyAppName,
            role: amplifyRole,
            cognitoAuth: cognitoAuth, // Pass Cognito auth for environment variables
        });
    }
}
exports.InfraStack = InfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYS1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMEQ7QUFDMUQsMkNBQTJDO0FBQzNDLDBEQUEwRDtBQUMxRCwyQ0FBMkM7QUFFM0MsMkNBQTJDO0FBQzNDLHNEQUFtRDtBQUNuRCwyQ0FBaUQ7QUFDakQsK0NBQXlEO0FBQ3pELGdFQUE2RDtBQUU3RCxNQUFhLFVBQVcsU0FBUSxtQkFBSztJQUNuQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQzlDLGlCQUFpQixFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztTQUN6QyxDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRWhELEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFdkQsTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDO1FBRWxDLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3BELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQztZQUM1RCxlQUFlLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FDeEMsNkJBQTZCLENBQzlCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWEsR0FBRyxJQUFBLHlCQUFXLEVBQUMsSUFBSSxFQUFFO1lBQ3RDLFNBQVMsRUFBRSxjQUFjO1NBQzFCLENBQUMsQ0FBQztRQUVILE1BQU0sV0FBVyxHQUFHLElBQUEscUNBQWlCLEVBQUMsSUFBSSxFQUFFO1lBQzFDLGdCQUFnQixFQUFFLHFCQUFxQjtTQUN4QyxDQUFDLENBQUM7UUFFSCxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUU5RCxJQUFBLDBCQUFnQixFQUFDLElBQUksRUFBRTtZQUNyQixPQUFPLEVBQUUsYUFBYTtZQUN0QixTQUFTLEVBQUUsYUFBYTtZQUN4QixXQUFXLEVBQUUsV0FBVyxFQUFFLCtCQUErQjtTQUMxRCxDQUFDLENBQUM7UUFFSCxJQUFBLDhCQUFvQixFQUFDLElBQUksRUFBRTtZQUN6QixPQUFPLEVBQUUsY0FBYztZQUN2QixJQUFJLEVBQUUsV0FBVztZQUNqQixXQUFXLEVBQUUsV0FBVyxFQUFFLDhDQUE4QztTQUN6RSxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUE3Q0QsZ0NBNkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRHVyYXRpb24sIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgc3VicyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zLXN1YnNjcmlwdGlvbnMnO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zcXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBjcmVhdGVUYWJsZSB9IGZyb20gJy4vdGFibGVzL2NyZWF0ZVRhYmxlJztcbmltcG9ydCB7IGNyZWF0ZUFwcFN5bmNBUEkgfSBmcm9tICcuL2FwaS9hcHBzeW5jJztcbmltcG9ydCB7IGNyZWF0ZUFtcGxpZnlIb3N0aW5nIH0gZnJvbSAnLi9ob3N0aW5nL2FtcGxpZnknO1xuaW1wb3J0IHsgY3JlYXRlQ29nbml0b0F1dGggfSBmcm9tICcuL2F1dGgvY3JlYXRlQ29nbml0b0F1dGgnO1xuXG5leHBvcnQgY2xhc3MgSW5mcmFTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ0luZnJhUXVldWUnLCB7XG4gICAgICB2aXNpYmlsaXR5VGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzMDApLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHRoaXMsICdJbmZyYVRvcGljJyk7XG5cbiAgICB0b3BpYy5hZGRTdWJzY3JpcHRpb24obmV3IHN1YnMuU3FzU3Vic2NyaXB0aW9uKHF1ZXVlKSk7XG5cbiAgICBjb25zdCBhbXBsaWZ5QXBwTmFtZSA9ICdGcm9udGVuZCc7XG5cbiAgICBjb25zdCBhbXBsaWZ5Um9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQW1wbGlmeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYW1wbGlmeS5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKFxuICAgICAgICAgICdBZG1pbmlzdHJhdG9yQWNjZXNzLUFtcGxpZnknXG4gICAgICAgICksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZHluYW1vREJUYWJsZSA9IGNyZWF0ZVRhYmxlKHRoaXMsIHtcbiAgICAgIHRhYmxlTmFtZTogJ2FwcERhdGFUYWJsZScsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb2duaXRvQXV0aCA9IGNyZWF0ZUNvZ25pdG9BdXRoKHRoaXMsIHtcbiAgICAgIGlkZW50aXR5UG9vbE5hbWU6ICdSYWludHJlZUd1ZXN0QWNjZXNzJyxcbiAgICB9KTtcblxuICAgIGNvZ25pdG9BdXRoLmdyYW50RnVsbER5bmFtb0RCQWNjZXNzKFtkeW5hbW9EQlRhYmxlLnRhYmxlQXJuXSk7XG5cbiAgICBjcmVhdGVBcHBTeW5jQVBJKHRoaXMsIHtcbiAgICAgIGFwaU5hbWU6ICd3ZWlnaHRzLWFwaScsXG4gICAgICBkYXRhVGFibGU6IGR5bmFtb0RCVGFibGUsXG4gICAgICBjb2duaXRvQXV0aDogY29nbml0b0F1dGgsIC8vIFBhc3MgQ29nbml0byBhdXRoIHRvIEFwcFN5bmNcbiAgICB9KTtcblxuICAgIGNyZWF0ZUFtcGxpZnlIb3N0aW5nKHRoaXMsIHtcbiAgICAgIGFwcE5hbWU6IGFtcGxpZnlBcHBOYW1lLFxuICAgICAgcm9sZTogYW1wbGlmeVJvbGUsXG4gICAgICBjb2duaXRvQXV0aDogY29nbml0b0F1dGgsIC8vIFBhc3MgQ29nbml0byBhdXRoIGZvciBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbiAgICB9KTtcbiAgfVxufVxuIl19