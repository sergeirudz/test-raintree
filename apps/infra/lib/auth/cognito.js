"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoAuth = void 0;
const cdk = require("aws-cdk-lib");
const cognito = require("aws-cdk-lib/aws-cognito");
const iam = require("aws-cdk-lib/aws-iam");
const constructs_1 = require("constructs");
class CognitoAuth extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.identityPool = new cognito.CfnIdentityPool(this, 'GuestIdentityPool', {
            identityPoolName: props?.identityPoolName || 'RaintreeGuestIdentityPool',
            allowUnauthenticatedIdentities: true,
        });
        this.unauthenticatedRole = new iam.Role(this, 'UnauthenticatedRole', {
            roleName: `${cdk.Stack.of(this).stackName}-cognito-unauth-role`,
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated',
                },
            }, 'sts:AssumeRoleWithWebIdentity'),
        });
        this.addBasicUnauthenticatedPolicies(props?.resourceArns);
        if (props?.additionalPolicyStatements) {
            props.additionalPolicyStatements.forEach((statement) => {
                this.unauthenticatedRole.addToPolicy(statement);
            });
        }
        new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                unauthenticated: this.unauthenticatedRole.roleArn,
            },
        });
        this.identityPoolId = this.identityPool.ref;
        new cdk.CfnOutput(this, 'IdentityPoolId', {
            value: this.identityPoolId,
            description: 'The ID of the Cognito Identity Pool for guest access',
            exportName: `${cdk.Stack.of(this).stackName}-cognito-identity-pool-id`,
        });
        new cdk.CfnOutput(this, 'UnauthenticatedRoleArn', {
            value: this.unauthenticatedRole.roleArn,
            description: 'ARN of the unauthenticated role',
            exportName: `${cdk.Stack.of(this).stackName}-cognito-unauth-role-arn`,
        });
    }
    addBasicUnauthenticatedPolicies(resourceArns) {
        const basicPolicyStatements = [];
        if (resourceArns && resourceArns.length > 0) {
            basicPolicyStatements.push(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    'geo:GetMap*',
                    'geo:SearchPlaceIndex*',
                    'geo:GetPlace',
                    'geo:CalculateRoute*',
                    'geo:GetGeofence',
                    'geo:ListGeofences',
                    'geo:GetDevicePosition*',
                    'geo:ListDevicePositions',
                    'geo:BatchGetDevicePosition',
                ],
                resources: resourceArns,
            }));
        }
        basicPolicyStatements.push(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
            ],
            resources: [
                `arn:aws:logs:${cdk.Stack.of(this).region}:${cdk.Stack.of(this).account}:log-group:/aws/cognito/*`,
            ],
        }));
        basicPolicyStatements.forEach((statement) => {
            this.unauthenticatedRole.addToPolicy(statement);
        });
    }
    addPolicyStatement(statement) {
        this.unauthenticatedRole.addToPolicy(statement);
    }
    grantReadOnlyDynamoDBAccess(tableArns) {
        this.unauthenticatedRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'dynamodb:GetItem',
                'dynamodb:Query',
                'dynamodb:Scan',
                'dynamodb:BatchGetItem',
            ],
            resources: tableArns,
        }));
    }
    grantFullDynamoDBAccess(tableArns) {
        const allTableResources = tableArns.flatMap(arn => [
            arn,
            `${arn}/*`,
            `${arn}/index/*`
        ]);
        this.unauthenticatedRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:Query',
                'dynamodb:Scan',
                'dynamodb:BatchGetItem',
                'dynamodb:BatchWriteItem',
            ],
            resources: allTableResources,
        }));
    }
    grantLambdaInvokeAccess(functionArns) {
        this.unauthenticatedRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['lambda:InvokeFunction'],
            resources: functionArns,
        }));
    }
    grantAppSyncAccess(apiArn) {
        this.unauthenticatedRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['appsync:GraphQL'],
            resources: [`${apiArn}/*`],
        }));
    }
}
exports.CognitoAuth = CognitoAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLG1EQUFtRDtBQUNuRCwyQ0FBMkM7QUFDM0MsMkNBQXVDO0FBUXZDLE1BQWEsV0FBWSxTQUFRLHNCQUFTO0lBS3hDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDekUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixJQUFJLDJCQUEyQjtZQUN4RSw4QkFBOEIsRUFBRSxJQUFJO1NBQ3JDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ25FLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsc0JBQXNCO1lBQy9ELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FDbkMsZ0NBQWdDLEVBQ2hDO2dCQUNFLFlBQVksRUFBRTtvQkFDWixvQ0FBb0MsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUc7aUJBQzVEO2dCQUNELHdCQUF3QixFQUFFO29CQUN4QixvQ0FBb0MsRUFBRSxpQkFBaUI7aUJBQ3hEO2FBQ0YsRUFDRCwrQkFBK0IsQ0FDaEM7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsK0JBQStCLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTFELElBQUksS0FBSyxFQUFFLDBCQUEwQixFQUFFLENBQUM7WUFDdEMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLE9B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QUFDO1lBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDeEIsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDNUIsU0FBUyxFQUFFLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQztTQUMzQixDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXhLRCxrQ0F3S0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29nbml0byc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBDb2duaXRvQXV0aFByb3BzIHtcbiAgaWRlbnRpdHlQb29sTmFtZT86IHN0cmluZztcbiAgYWRkaXRpb25hbFBvbGljeVN0YXRlbWVudHM/OiBpYW0uUG9saWN5U3RhdGVtZW50W107XG4gIHJlc291cmNlQXJucz86IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgQ29nbml0b0F1dGggZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgaWRlbnRpdHlQb29sOiBjb2duaXRvLkNmbklkZW50aXR5UG9vbDtcbiAgcHVibGljIHJlYWRvbmx5IGlkZW50aXR5UG9vbElkOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSB1bmF1dGhlbnRpY2F0ZWRSb2xlOiBpYW0uUm9sZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IENvZ25pdG9BdXRoUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5pZGVudGl0eVBvb2wgPSBuZXcgY29nbml0by5DZm5JZGVudGl0eVBvb2wodGhpcywgJ0d1ZXN0SWRlbnRpdHlQb29sJywge1xuICAgICAgaWRlbnRpdHlQb29sTmFtZTogcHJvcHM/LmlkZW50aXR5UG9vbE5hbWUgfHwgJ1JhaW50cmVlR3Vlc3RJZGVudGl0eVBvb2wnLFxuICAgICAgYWxsb3dVbmF1dGhlbnRpY2F0ZWRJZGVudGl0aWVzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdVbmF1dGhlbnRpY2F0ZWRSb2xlJywge1xuICAgICAgcm9sZU5hbWU6IGAke2Nkay5TdGFjay5vZih0aGlzKS5zdGFja05hbWV9LWNvZ25pdG8tdW5hdXRoLXJvbGVgLFxuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkZlZGVyYXRlZFByaW5jaXBhbChcbiAgICAgICAgJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbScsXG4gICAgICAgIHtcbiAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206YXVkJzogdGhpcy5pZGVudGl0eVBvb2wucmVmLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0ZvckFueVZhbHVlOlN0cmluZ0xpa2UnOiB7XG4gICAgICAgICAgICAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOmFtcic6ICd1bmF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdzdHM6QXNzdW1lUm9sZVdpdGhXZWJJZGVudGl0eSdcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZEJhc2ljVW5hdXRoZW50aWNhdGVkUG9saWNpZXMocHJvcHM/LnJlc291cmNlQXJucyk7XG5cbiAgICBpZiAocHJvcHM/LmFkZGl0aW9uYWxQb2xpY3lTdGF0ZW1lbnRzKSB7XG4gICAgICBwcm9wcy5hZGRpdGlvbmFsUG9saWN5U3RhdGVtZW50cy5mb3JFYWNoKChzdGF0ZW1lbnQpID0+IHtcbiAgICAgICAgdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlLmFkZFRvUG9saWN5KHN0YXRlbWVudCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBuZXcgY29nbml0by5DZm5JZGVudGl0eVBvb2xSb2xlQXR0YWNobWVudChcbiAgICAgIHRoaXMsXG4gICAgICAnSWRlbnRpdHlQb29sUm9sZUF0dGFjaG1lbnQnLFxuICAgICAge1xuICAgICAgICBpZGVudGl0eVBvb2xJZDogdGhpcy5pZGVudGl0eVBvb2wucmVmLFxuICAgICAgICByb2xlczoge1xuICAgICAgICAgIHVuYXV0aGVudGljYXRlZDogdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlLnJvbGVBcm4sXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuaWRlbnRpdHlQb29sSWQgPSB0aGlzLmlkZW50aXR5UG9vbC5yZWY7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnSWRlbnRpdHlQb29sSWQnLCB7XG4gICAgICB2YWx1ZTogdGhpcy5pZGVudGl0eVBvb2xJZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIElEIG9mIHRoZSBDb2duaXRvIElkZW50aXR5IFBvb2wgZm9yIGd1ZXN0IGFjY2VzcycsXG4gICAgICBleHBvcnROYW1lOiBgJHtjZGsuU3RhY2sub2YodGhpcykuc3RhY2tOYW1lfS1jb2duaXRvLWlkZW50aXR5LXBvb2wtaWRgLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1VuYXV0aGVudGljYXRlZFJvbGVBcm4nLCB7XG4gICAgICB2YWx1ZTogdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlLnJvbGVBcm4sXG4gICAgICBkZXNjcmlwdGlvbjogJ0FSTiBvZiB0aGUgdW5hdXRoZW50aWNhdGVkIHJvbGUnLFxuICAgICAgZXhwb3J0TmFtZTogYCR7Y2RrLlN0YWNrLm9mKHRoaXMpLnN0YWNrTmFtZX0tY29nbml0by11bmF1dGgtcm9sZS1hcm5gLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGRCYXNpY1VuYXV0aGVudGljYXRlZFBvbGljaWVzKHJlc291cmNlQXJucz86IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgYmFzaWNQb2xpY3lTdGF0ZW1lbnRzOiBpYW0uUG9saWN5U3RhdGVtZW50W10gPSBbXTtcblxuICAgIGlmIChyZXNvdXJjZUFybnMgJiYgcmVzb3VyY2VBcm5zLmxlbmd0aCA+IDApIHtcbiAgICAgIGJhc2ljUG9saWN5U3RhdGVtZW50cy5wdXNoKFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICdnZW86R2V0TWFwKicsXG4gICAgICAgICAgICAnZ2VvOlNlYXJjaFBsYWNlSW5kZXgqJyxcbiAgICAgICAgICAgICdnZW86R2V0UGxhY2UnLFxuICAgICAgICAgICAgJ2dlbzpDYWxjdWxhdGVSb3V0ZSonLFxuICAgICAgICAgICAgJ2dlbzpHZXRHZW9mZW5jZScsXG4gICAgICAgICAgICAnZ2VvOkxpc3RHZW9mZW5jZXMnLFxuICAgICAgICAgICAgJ2dlbzpHZXREZXZpY2VQb3NpdGlvbionLFxuICAgICAgICAgICAgJ2dlbzpMaXN0RGV2aWNlUG9zaXRpb25zJyxcbiAgICAgICAgICAgICdnZW86QmF0Y2hHZXREZXZpY2VQb3NpdGlvbicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICByZXNvdXJjZXM6IHJlc291cmNlQXJucyxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgYmFzaWNQb2xpY3lTdGF0ZW1lbnRzLnB1c2goXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ0dyb3VwJyxcbiAgICAgICAgICAnbG9nczpDcmVhdGVMb2dTdHJlYW0nLFxuICAgICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgIGBhcm46YXdzOmxvZ3M6JHtjZGsuU3RhY2sub2YodGhpcykucmVnaW9ufToke2Nkay5TdGFjay5vZih0aGlzKS5hY2NvdW50fTpsb2ctZ3JvdXA6L2F3cy9jb2duaXRvLypgLFxuICAgICAgICBdLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgYmFzaWNQb2xpY3lTdGF0ZW1lbnRzLmZvckVhY2goKHN0YXRlbWVudCkgPT4ge1xuICAgICAgdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlLmFkZFRvUG9saWN5KHN0YXRlbWVudCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkUG9saWN5U3RhdGVtZW50KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCk6IHZvaWQge1xuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5hZGRUb1BvbGljeShzdGF0ZW1lbnQpO1xuICB9XG5cbiAgcHVibGljIGdyYW50UmVhZE9ubHlEeW5hbW9EQkFjY2Vzcyh0YWJsZUFybnM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlLmFkZFRvUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnZHluYW1vZGI6R2V0SXRlbScsXG4gICAgICAgICAgJ2R5bmFtb2RiOlF1ZXJ5JyxcbiAgICAgICAgICAnZHluYW1vZGI6U2NhbicsXG4gICAgICAgICAgJ2R5bmFtb2RiOkJhdGNoR2V0SXRlbScsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogdGFibGVBcm5zLFxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGdyYW50RnVsbER5bmFtb0RCQWNjZXNzKHRhYmxlQXJuczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBjb25zdCBhbGxUYWJsZVJlc291cmNlcyA9IHRhYmxlQXJucy5mbGF0TWFwKGFybiA9PiBbXG4gICAgICBhcm4sXG4gICAgICBgJHthcm59LypgLFxuICAgICAgYCR7YXJufS9pbmRleC8qYFxuICAgIF0pO1xuICAgIFxuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5hZGRUb1BvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ2R5bmFtb2RiOkdldEl0ZW0nLFxuICAgICAgICAgICdkeW5hbW9kYjpQdXRJdGVtJyxcbiAgICAgICAgICAnZHluYW1vZGI6VXBkYXRlSXRlbScsXG4gICAgICAgICAgJ2R5bmFtb2RiOkRlbGV0ZUl0ZW0nLFxuICAgICAgICAgICdkeW5hbW9kYjpRdWVyeScsXG4gICAgICAgICAgJ2R5bmFtb2RiOlNjYW4nLFxuICAgICAgICAgICdkeW5hbW9kYjpCYXRjaEdldEl0ZW0nLFxuICAgICAgICAgICdkeW5hbW9kYjpCYXRjaFdyaXRlSXRlbScsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogYWxsVGFibGVSZXNvdXJjZXMsXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRMYW1iZGFJbnZva2VBY2Nlc3MoZnVuY3Rpb25Bcm5zOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5hZGRUb1BvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ2xhbWJkYTpJbnZva2VGdW5jdGlvbiddLFxuICAgICAgICByZXNvdXJjZXM6IGZ1bmN0aW9uQXJucyxcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudEFwcFN5bmNBY2Nlc3MoYXBpQXJuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnVuYXV0aGVudGljYXRlZFJvbGUuYWRkVG9Qb2xpY3koXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgYWN0aW9uczogWydhcHBzeW5jOkdyYXBoUUwnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbYCR7YXBpQXJufS8qYF0sXG4gICAgICB9KVxuICAgICk7XG4gIH1cbn1cbiJdfQ==