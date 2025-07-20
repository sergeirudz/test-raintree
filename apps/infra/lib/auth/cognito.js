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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLG1EQUFtRDtBQUNuRCwyQ0FBMkM7QUFDM0MsMkNBQXVDO0FBaUJ2QyxNQUFhLFdBQVksU0FBUSxzQkFBUztJQUt4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQ3pFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxnQkFBZ0IsSUFBSSwyQkFBMkI7WUFDeEUsOEJBQThCLEVBQUUsSUFBSTtTQUNyQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNuRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLHNCQUFzQjtZQUMvRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQ25DLGdDQUFnQyxFQUNoQztnQkFDRSxZQUFZLEVBQUU7b0JBQ1osb0NBQW9DLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHO2lCQUM1RDtnQkFDRCx3QkFBd0IsRUFBRTtvQkFDeEIsb0NBQW9DLEVBQUUsaUJBQWlCO2lCQUN4RDthQUNGLEVBQ0QsK0JBQStCLENBQ2hDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLCtCQUErQixDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUxRCxJQUFJLEtBQUssRUFBRSwwQkFBMEIsRUFBRSxDQUFDO1lBQ3RDLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxP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WUFDdEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztZQUN4QixPQUFPLEVBQUU7Z0JBQ1Asa0JBQWtCO2dCQUNsQixnQkFBZ0I7Z0JBQ2hCLGVBQWU7Z0JBQ2YsdUJBQXVCO2FBQ3hCO1lBQ0QsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRU0sdUJBQXVCLENBQUMsWUFBc0I7UUFDbkQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FDbEMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDeEIsT0FBTyxFQUFFLENBQUMsdUJBQXVCLENBQUM7WUFDbEMsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRU0sa0JBQWtCLENBQUMsTUFBYztRQUN0QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUNsQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztZQUN4QixPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztZQUM1QixTQUFTLEVBQUUsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDO1NBQzNCLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBL0lELGtDQStJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvZ25pdG9BdXRoUHJvcHMge1xuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGlkZW50aXR5IHBvb2xcbiAgICovXG4gIGlkZW50aXR5UG9vbE5hbWU/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIElBTSBwb2xpY3kgc3RhdGVtZW50cyBmb3IgdW5hdXRoZW50aWNhdGVkIHVzZXJzXG4gICAqL1xuICBhZGRpdGlvbmFsUG9saWN5U3RhdGVtZW50cz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXTtcbiAgLyoqXG4gICAqIFJlc291cmNlIEFSTnMgdGhhdCB1bmF1dGhlbnRpY2F0ZWQgdXNlcnMgc2hvdWxkIGhhdmUgYWNjZXNzIHRvXG4gICAqL1xuICByZXNvdXJjZUFybnM/OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIENvZ25pdG9BdXRoIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGlkZW50aXR5UG9vbDogY29nbml0by5DZm5JZGVudGl0eVBvb2w7XG4gIHB1YmxpYyByZWFkb25seSBpZGVudGl0eVBvb2xJZDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdW5hdXRoZW50aWNhdGVkUm9sZTogaWFtLlJvbGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBDb2duaXRvQXV0aFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuaWRlbnRpdHlQb29sID0gbmV3IGNvZ25pdG8uQ2ZuSWRlbnRpdHlQb29sKHRoaXMsICdHdWVzdElkZW50aXR5UG9vbCcsIHtcbiAgICAgIGlkZW50aXR5UG9vbE5hbWU6IHByb3BzPy5pZGVudGl0eVBvb2xOYW1lIHx8ICdSYWludHJlZUd1ZXN0SWRlbnRpdHlQb29sJyxcbiAgICAgIGFsbG93VW5hdXRoZW50aWNhdGVkSWRlbnRpdGllczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnVW5hdXRoZW50aWNhdGVkUm9sZScsIHtcbiAgICAgIHJvbGVOYW1lOiBgJHtjZGsuU3RhY2sub2YodGhpcykuc3RhY2tOYW1lfS1jb2duaXRvLXVuYXV0aC1yb2xlYCxcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5GZWRlcmF0ZWRQcmluY2lwYWwoXG4gICAgICAgICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20nLFxuICAgICAgICB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOmF1ZCc6IHRoaXMuaWRlbnRpdHlQb29sLnJlZixcbiAgICAgICAgICB9LFxuICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdMaWtlJzoge1xuICAgICAgICAgICAgJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphbXInOiAndW5hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnc3RzOkFzc3VtZVJvbGVXaXRoV2ViSWRlbnRpdHknXG4gICAgICApLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRCYXNpY1VuYXV0aGVudGljYXRlZFBvbGljaWVzKHByb3BzPy5yZXNvdXJjZUFybnMpO1xuXG4gICAgaWYgKHByb3BzPy5hZGRpdGlvbmFsUG9saWN5U3RhdGVtZW50cykge1xuICAgICAgcHJvcHMuYWRkaXRpb25hbFBvbGljeVN0YXRlbWVudHMuZm9yRWFjaCgoc3RhdGVtZW50KSA9PiB7XG4gICAgICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5hZGRUb1BvbGljeShzdGF0ZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmV3IGNvZ25pdG8uQ2ZuSWRlbnRpdHlQb29sUm9sZUF0dGFjaG1lbnQoXG4gICAgICB0aGlzLFxuICAgICAgJ0lkZW50aXR5UG9vbFJvbGVBdHRhY2htZW50JyxcbiAgICAgIHtcbiAgICAgICAgaWRlbnRpdHlQb29sSWQ6IHRoaXMuaWRlbnRpdHlQb29sLnJlZixcbiAgICAgICAgcm9sZXM6IHtcbiAgICAgICAgICB1bmF1dGhlbnRpY2F0ZWQ6IHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5yb2xlQXJuLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG5cbiAgICB0aGlzLmlkZW50aXR5UG9vbElkID0gdGhpcy5pZGVudGl0eVBvb2wucmVmO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0lkZW50aXR5UG9vbElkJywge1xuICAgICAgdmFsdWU6IHRoaXMuaWRlbnRpdHlQb29sSWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBJRCBvZiB0aGUgQ29nbml0byBJZGVudGl0eSBQb29sIGZvciBndWVzdCBhY2Nlc3MnLFxuICAgICAgZXhwb3J0TmFtZTogYCR7Y2RrLlN0YWNrLm9mKHRoaXMpLnN0YWNrTmFtZX0tY29nbml0by1pZGVudGl0eS1wb29sLWlkYCxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdVbmF1dGhlbnRpY2F0ZWRSb2xlQXJuJywge1xuICAgICAgdmFsdWU6IHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5yb2xlQXJuLFxuICAgICAgZGVzY3JpcHRpb246ICdBUk4gb2YgdGhlIHVuYXV0aGVudGljYXRlZCByb2xlJyxcbiAgICAgIGV4cG9ydE5hbWU6IGAke2Nkay5TdGFjay5vZih0aGlzKS5zdGFja05hbWV9LWNvZ25pdG8tdW5hdXRoLXJvbGUtYXJuYCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYWRkQmFzaWNVbmF1dGhlbnRpY2F0ZWRQb2xpY2llcyhyZXNvdXJjZUFybnM/OiBzdHJpbmdbXSkge1xuICAgIGNvbnN0IGJhc2ljUG9saWN5U3RhdGVtZW50czogaWFtLlBvbGljeVN0YXRlbWVudFtdID0gW107XG5cbiAgICBpZiAocmVzb3VyY2VBcm5zICYmIHJlc291cmNlQXJucy5sZW5ndGggPiAwKSB7XG4gICAgICBiYXNpY1BvbGljeVN0YXRlbWVudHMucHVzaChcbiAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAnZ2VvOkdldE1hcConLFxuICAgICAgICAgICAgJ2dlbzpTZWFyY2hQbGFjZUluZGV4KicsXG4gICAgICAgICAgICAnZ2VvOkdldFBsYWNlJyxcbiAgICAgICAgICAgICdnZW86Q2FsY3VsYXRlUm91dGUqJyxcbiAgICAgICAgICAgICdnZW86R2V0R2VvZmVuY2UnLFxuICAgICAgICAgICAgJ2dlbzpMaXN0R2VvZmVuY2VzJyxcbiAgICAgICAgICAgICdnZW86R2V0RGV2aWNlUG9zaXRpb24qJyxcbiAgICAgICAgICAgICdnZW86TGlzdERldmljZVBvc2l0aW9ucycsXG4gICAgICAgICAgICAnZ2VvOkJhdGNoR2V0RGV2aWNlUG9zaXRpb24nLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgcmVzb3VyY2VzOiByZXNvdXJjZUFybnMsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGJhc2ljUG9saWN5U3RhdGVtZW50cy5wdXNoKFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnbG9nczpDcmVhdGVMb2dHcm91cCcsXG4gICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICBdLFxuICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICBgYXJuOmF3czpsb2dzOiR7Y2RrLlN0YWNrLm9mKHRoaXMpLnJlZ2lvbn06JHtjZGsuU3RhY2sub2YodGhpcykuYWNjb3VudH06bG9nLWdyb3VwOi9hd3MvY29nbml0by8qYCxcbiAgICAgICAgXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGJhc2ljUG9saWN5U3RhdGVtZW50cy5mb3JFYWNoKChzdGF0ZW1lbnQpID0+IHtcbiAgICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5hZGRUb1BvbGljeShzdGF0ZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZFBvbGljeVN0YXRlbWVudChzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLnVuYXV0aGVudGljYXRlZFJvbGUuYWRkVG9Qb2xpY3koc3RhdGVtZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudFJlYWRPbmx5RHluYW1vREJBY2Nlc3ModGFibGVBcm5zOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5hZGRUb1BvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ2R5bmFtb2RiOkdldEl0ZW0nLFxuICAgICAgICAgICdkeW5hbW9kYjpRdWVyeScsXG4gICAgICAgICAgJ2R5bmFtb2RiOlNjYW4nLFxuICAgICAgICAgICdkeW5hbW9kYjpCYXRjaEdldEl0ZW0nLFxuICAgICAgICBdLFxuICAgICAgICByZXNvdXJjZXM6IHRhYmxlQXJucyxcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudExhbWJkYUludm9rZUFjY2VzcyhmdW5jdGlvbkFybnM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlLmFkZFRvUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFsnbGFtYmRhOkludm9rZUZ1bmN0aW9uJ10sXG4gICAgICAgIHJlc291cmNlczogZnVuY3Rpb25Bcm5zLFxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGdyYW50QXBwU3luY0FjY2VzcyhhcGlBcm46IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5hZGRUb1BvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ2FwcHN5bmM6R3JhcGhRTCddLFxuICAgICAgICByZXNvdXJjZXM6IFtgJHthcGlBcm59LypgXSxcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuIl19