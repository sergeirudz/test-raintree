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
        // Create Cognito Identity Pool
        this.identityPool = new cognito.CfnIdentityPool(this, 'GuestIdentityPool', {
            identityPoolName: props?.identityPoolName || 'RaintreeGuestIdentityPool',
            allowUnauthenticatedIdentities: true,
        });
        // Create IAM role for unauthenticated users
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
        // Add basic policies for unauthenticated users
        this.addBasicUnauthenticatedPolicies(props?.resourceArns);
        // Add any additional policy statements
        if (props?.additionalPolicyStatements) {
            props.additionalPolicyStatements.forEach((statement) => {
                this.unauthenticatedRole.addToPolicy(statement);
            });
        }
        // Attach the role to the identity pool
        new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                unauthenticated: this.unauthenticatedRole.roleArn,
            },
        });
        // Store the identity pool ID for easy access
        this.identityPoolId = this.identityPool.ref;
        // Output the identity pool ID
        new cdk.CfnOutput(this, 'IdentityPoolId', {
            value: this.identityPoolId,
            description: 'The ID of the Cognito Identity Pool for guest access',
            exportName: `${cdk.Stack.of(this).stackName}-cognito-identity-pool-id`,
        });
        // Output the unauthenticated role ARN
        new cdk.CfnOutput(this, 'UnauthenticatedRoleArn', {
            value: this.unauthenticatedRole.roleArn,
            description: 'ARN of the unauthenticated role',
            exportName: `${cdk.Stack.of(this).stackName}-cognito-unauth-role-arn`,
        });
    }
    /**
     * Add basic policies that are commonly needed for unauthenticated users
     */
    addBasicUnauthenticatedPolicies(resourceArns) {
        // Basic AWS service permissions that are safe for unauthenticated users
        const basicPolicyStatements = [];
        // Allow basic AWS service actions if needed
        // You can customize these based on your application needs
        if (resourceArns && resourceArns.length > 0) {
            // Add permissions for specific resources
            basicPolicyStatements.push(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    // Add actions based on your needs
                    // For example, if you're using Amazon Location Service:
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
        // Add CloudWatch logs permissions for client-side logging (optional)
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
        // Apply all basic policy statements
        basicPolicyStatements.forEach((statement) => {
            this.unauthenticatedRole.addToPolicy(statement);
        });
    }
    /**
     * Add a custom policy statement to the unauthenticated role
     */
    addPolicyStatement(statement) {
        this.unauthenticatedRole.addToPolicy(statement);
    }
    /**
     * Grant permissions to access DynamoDB tables (read-only for guests)
     */
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
    /**
     * Grant permissions to invoke specific Lambda functions
     */
    grantLambdaInvokeAccess(functionArns) {
        this.unauthenticatedRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['lambda:InvokeFunction'],
            resources: functionArns,
        }));
    }
    /**
     * Grant permissions to access S3 buckets (read-only for guests)
     */
    grantS3ReadAccess(bucketArns) {
        const resourceArns = bucketArns.flatMap((bucketArn) => [
            bucketArn,
            `${bucketArn}/*`,
        ]);
        this.unauthenticatedRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['s3:GetObject', 's3:GetObjectVersion', 's3:ListBucket'],
            resources: resourceArns,
        }));
    }
    /**
     * Grant permissions to access AppSync GraphQL API
     */
    grantAppSyncAccess(apiArn) {
        this.unauthenticatedRole.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['appsync:GraphQL'],
            resources: [`${apiArn}/*`],
        }));
    }
}
exports.CognitoAuth = CognitoAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLG1EQUFtRDtBQUNuRCwyQ0FBMkM7QUFDM0MsMkNBQXVDO0FBaUJ2QyxNQUFhLFdBQVksU0FBUSxzQkFBUztJQUt4QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUN6RSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLElBQUksMkJBQTJCO1lBQ3hFLDhCQUE4QixFQUFFLElBQUk7U0FDckMsQ0FBQyxDQUFDO1FBRUgsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ25FLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsc0JBQXNCO1lBQy9ELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsQ0FDbkMsZ0NBQWdDLEVBQ2hDO2dCQUNFLFlBQVksRUFBRTtvQkFDWixvQ0FBb0MsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUc7aUJBQzVEO2dCQUNELHdCQUF3QixFQUFFO29CQUN4QixvQ0FBb0MsRUFBRSxpQkFBaUI7aUJBQ3hEO2FBQ0YsRUFDRCwrQkFBK0IsQ0FDaEM7U0FDRixDQUFDLENBQUM7UUFFSCwrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLCtCQUErQixDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUxRCx1Q0FBdUM7UUFDdkMsSUFBSSxLQUFL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Q0FBQyxjQUFjLEVBQUUscUJBQXFCLEVBQUUsZUFBZSxDQUFDO1lBQ2pFLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVEOztPQUVHO0lBQ0ksa0JBQWtCLENBQUMsTUFBYztRQUN0QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUNsQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztZQUN4QixPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztZQUM1QixTQUFTLEVBQUUsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDO1NBQzNCLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBaE1ELGtDQWdNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvZ25pdG9BdXRoUHJvcHMge1xuICAvKipcbiAgICogTmFtZSBmb3IgdGhlIGlkZW50aXR5IHBvb2xcbiAgICovXG4gIGlkZW50aXR5UG9vbE5hbWU/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIElBTSBwb2xpY3kgc3RhdGVtZW50cyBmb3IgdW5hdXRoZW50aWNhdGVkIHVzZXJzXG4gICAqL1xuICBhZGRpdGlvbmFsUG9saWN5U3RhdGVtZW50cz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXTtcbiAgLyoqXG4gICAqIFJlc291cmNlIEFSTnMgdGhhdCB1bmF1dGhlbnRpY2F0ZWQgdXNlcnMgc2hvdWxkIGhhdmUgYWNjZXNzIHRvXG4gICAqL1xuICByZXNvdXJjZUFybnM/OiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIENvZ25pdG9BdXRoIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGlkZW50aXR5UG9vbDogY29nbml0by5DZm5JZGVudGl0eVBvb2w7XG4gIHB1YmxpYyByZWFkb25seSBpZGVudGl0eVBvb2xJZDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdW5hdXRoZW50aWNhdGVkUm9sZTogaWFtLlJvbGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBDb2duaXRvQXV0aFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIENyZWF0ZSBDb2duaXRvIElkZW50aXR5IFBvb2xcbiAgICB0aGlzLmlkZW50aXR5UG9vbCA9IG5ldyBjb2duaXRvLkNmbklkZW50aXR5UG9vbCh0aGlzLCAnR3Vlc3RJZGVudGl0eVBvb2wnLCB7XG4gICAgICBpZGVudGl0eVBvb2xOYW1lOiBwcm9wcz8uaWRlbnRpdHlQb29sTmFtZSB8fCAnUmFpbnRyZWVHdWVzdElkZW50aXR5UG9vbCcsXG4gICAgICBhbGxvd1VuYXV0aGVudGljYXRlZElkZW50aXRpZXM6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgSUFNIHJvbGUgZm9yIHVuYXV0aGVudGljYXRlZCB1c2Vyc1xuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnVW5hdXRoZW50aWNhdGVkUm9sZScsIHtcbiAgICAgIHJvbGVOYW1lOiBgJHtjZGsuU3RhY2sub2YodGhpcykuc3RhY2tOYW1lfS1jb2duaXRvLXVuYXV0aC1yb2xlYCxcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5GZWRlcmF0ZWRQcmluY2lwYWwoXG4gICAgICAgICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20nLFxuICAgICAgICB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOmF1ZCc6IHRoaXMuaWRlbnRpdHlQb29sLnJlZixcbiAgICAgICAgICB9LFxuICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdMaWtlJzoge1xuICAgICAgICAgICAgJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphbXInOiAndW5hdXRoZW50aWNhdGVkJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnc3RzOkFzc3VtZVJvbGVXaXRoV2ViSWRlbnRpdHknXG4gICAgICApLFxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGJhc2ljIHBvbGljaWVzIGZvciB1bmF1dGhlbnRpY2F0ZWQgdXNlcnNcbiAgICB0aGlzLmFkZEJhc2ljVW5hdXRoZW50aWNhdGVkUG9saWNpZXMocHJvcHM/LnJlc291cmNlQXJucyk7XG5cbiAgICAvLyBBZGQgYW55IGFkZGl0aW9uYWwgcG9saWN5IHN0YXRlbWVudHNcbiAgICBpZiAocHJvcHM/LmFkZGl0aW9uYWxQb2xpY3lTdGF0ZW1lbnRzKSB7XG4gICAgICBwcm9wcy5hZGRpdGlvbmFsUG9saWN5U3RhdGVtZW50cy5mb3JFYWNoKChzdGF0ZW1lbnQpID0+IHtcbiAgICAgICAgdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlLmFkZFRvUG9saWN5KHN0YXRlbWVudCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBdHRhY2ggdGhlIHJvbGUgdG8gdGhlIGlkZW50aXR5IHBvb2xcbiAgICBuZXcgY29nbml0by5DZm5JZGVudGl0eVBvb2xSb2xlQXR0YWNobWVudChcbiAgICAgIHRoaXMsXG4gICAgICAnSWRlbnRpdHlQb29sUm9sZUF0dGFjaG1lbnQnLFxuICAgICAge1xuICAgICAgICBpZGVudGl0eVBvb2xJZDogdGhpcy5pZGVudGl0eVBvb2wucmVmLFxuICAgICAgICByb2xlczoge1xuICAgICAgICAgIHVuYXV0aGVudGljYXRlZDogdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlLnJvbGVBcm4sXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIFN0b3JlIHRoZSBpZGVudGl0eSBwb29sIElEIGZvciBlYXN5IGFjY2Vzc1xuICAgIHRoaXMuaWRlbnRpdHlQb29sSWQgPSB0aGlzLmlkZW50aXR5UG9vbC5yZWY7XG5cbiAgICAvLyBPdXRwdXQgdGhlIGlkZW50aXR5IHBvb2wgSURcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnSWRlbnRpdHlQb29sSWQnLCB7XG4gICAgICB2YWx1ZTogdGhpcy5pZGVudGl0eVBvb2xJZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIElEIG9mIHRoZSBDb2duaXRvIElkZW50aXR5IFBvb2wgZm9yIGd1ZXN0IGFjY2VzcycsXG4gICAgICBleHBvcnROYW1lOiBgJHtjZGsuU3RhY2sub2YodGhpcykuc3RhY2tOYW1lfS1jb2duaXRvLWlkZW50aXR5LXBvb2wtaWRgLFxuICAgIH0pO1xuXG4gICAgLy8gT3V0cHV0IHRoZSB1bmF1dGhlbnRpY2F0ZWQgcm9sZSBBUk5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnVW5hdXRoZW50aWNhdGVkUm9sZUFybicsIHtcbiAgICAgIHZhbHVlOiB0aGlzLnVuYXV0aGVudGljYXRlZFJvbGUucm9sZUFybixcbiAgICAgIGRlc2NyaXB0aW9uOiAnQVJOIG9mIHRoZSB1bmF1dGhlbnRpY2F0ZWQgcm9sZScsXG4gICAgICBleHBvcnROYW1lOiBgJHtjZGsuU3RhY2sub2YodGhpcykuc3RhY2tOYW1lfS1jb2duaXRvLXVuYXV0aC1yb2xlLWFybmAsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGJhc2ljIHBvbGljaWVzIHRoYXQgYXJlIGNvbW1vbmx5IG5lZWRlZCBmb3IgdW5hdXRoZW50aWNhdGVkIHVzZXJzXG4gICAqL1xuICBwcml2YXRlIGFkZEJhc2ljVW5hdXRoZW50aWNhdGVkUG9saWNpZXMocmVzb3VyY2VBcm5zPzogc3RyaW5nW10pIHtcbiAgICAvLyBCYXNpYyBBV1Mgc2VydmljZSBwZXJtaXNzaW9ucyB0aGF0IGFyZSBzYWZlIGZvciB1bmF1dGhlbnRpY2F0ZWQgdXNlcnNcbiAgICBjb25zdCBiYXNpY1BvbGljeVN0YXRlbWVudHM6IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXSA9IFtdO1xuXG4gICAgLy8gQWxsb3cgYmFzaWMgQVdTIHNlcnZpY2UgYWN0aW9ucyBpZiBuZWVkZWRcbiAgICAvLyBZb3UgY2FuIGN1c3RvbWl6ZSB0aGVzZSBiYXNlZCBvbiB5b3VyIGFwcGxpY2F0aW9uIG5lZWRzXG4gICAgaWYgKHJlc291cmNlQXJucyAmJiByZXNvdXJjZUFybnMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gQWRkIHBlcm1pc3Npb25zIGZvciBzcGVjaWZpYyByZXNvdXJjZXNcbiAgICAgIGJhc2ljUG9saWN5U3RhdGVtZW50cy5wdXNoKFxuICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgIC8vIEFkZCBhY3Rpb25zIGJhc2VkIG9uIHlvdXIgbmVlZHNcbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlLCBpZiB5b3UncmUgdXNpbmcgQW1hem9uIExvY2F0aW9uIFNlcnZpY2U6XG4gICAgICAgICAgICAnZ2VvOkdldE1hcConLFxuICAgICAgICAgICAgJ2dlbzpTZWFyY2hQbGFjZUluZGV4KicsXG4gICAgICAgICAgICAnZ2VvOkdldFBsYWNlJyxcbiAgICAgICAgICAgICdnZW86Q2FsY3VsYXRlUm91dGUqJyxcbiAgICAgICAgICAgICdnZW86R2V0R2VvZmVuY2UnLFxuICAgICAgICAgICAgJ2dlbzpMaXN0R2VvZmVuY2VzJyxcbiAgICAgICAgICAgICdnZW86R2V0RGV2aWNlUG9zaXRpb24qJyxcbiAgICAgICAgICAgICdnZW86TGlzdERldmljZVBvc2l0aW9ucycsXG4gICAgICAgICAgICAnZ2VvOkJhdGNoR2V0RGV2aWNlUG9zaXRpb24nLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgcmVzb3VyY2VzOiByZXNvdXJjZUFybnMsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIEFkZCBDbG91ZFdhdGNoIGxvZ3MgcGVybWlzc2lvbnMgZm9yIGNsaWVudC1zaWRlIGxvZ2dpbmcgKG9wdGlvbmFsKVxuICAgIGJhc2ljUG9saWN5U3RhdGVtZW50cy5wdXNoKFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnbG9nczpDcmVhdGVMb2dHcm91cCcsXG4gICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICBdLFxuICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICBgYXJuOmF3czpsb2dzOiR7Y2RrLlN0YWNrLm9mKHRoaXMpLnJlZ2lvbn06JHtjZGsuU3RhY2sub2YodGhpcykuYWNjb3VudH06bG9nLWdyb3VwOi9hd3MvY29nbml0by8qYCxcbiAgICAgICAgXSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIEFwcGx5IGFsbCBiYXNpYyBwb2xpY3kgc3RhdGVtZW50c1xuICAgIGJhc2ljUG9saWN5U3RhdGVtZW50cy5mb3JFYWNoKChzdGF0ZW1lbnQpID0+IHtcbiAgICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5hZGRUb1BvbGljeShzdGF0ZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGN1c3RvbSBwb2xpY3kgc3RhdGVtZW50IHRvIHRoZSB1bmF1dGhlbnRpY2F0ZWQgcm9sZVxuICAgKi9cbiAgcHVibGljIGFkZFBvbGljeVN0YXRlbWVudChzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiB2b2lkIHtcbiAgICB0aGlzLnVuYXV0aGVudGljYXRlZFJvbGUuYWRkVG9Qb2xpY3koc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byBhY2Nlc3MgRHluYW1vREIgdGFibGVzIChyZWFkLW9ubHkgZm9yIGd1ZXN0cylcbiAgICovXG4gIHB1YmxpYyBncmFudFJlYWRPbmx5RHluYW1vREJBY2Nlc3ModGFibGVBcm5zOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMudW5hdXRoZW50aWNhdGVkUm9sZS5hZGRUb1BvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ2R5bmFtb2RiOkdldEl0ZW0nLFxuICAgICAgICAgICdkeW5hbW9kYjpRdWVyeScsXG4gICAgICAgICAgJ2R5bmFtb2RiOlNjYW4nLFxuICAgICAgICAgICdkeW5hbW9kYjpCYXRjaEdldEl0ZW0nLFxuICAgICAgICBdLFxuICAgICAgICByZXNvdXJjZXM6IHRhYmxlQXJucyxcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudCBwZXJtaXNzaW9ucyB0byBpbnZva2Ugc3BlY2lmaWMgTGFtYmRhIGZ1bmN0aW9uc1xuICAgKi9cbiAgcHVibGljIGdyYW50TGFtYmRhSW52b2tlQWNjZXNzKGZ1bmN0aW9uQXJuczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB0aGlzLnVuYXV0aGVudGljYXRlZFJvbGUuYWRkVG9Qb2xpY3koXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgYWN0aW9uczogWydsYW1iZGE6SW52b2tlRnVuY3Rpb24nXSxcbiAgICAgICAgcmVzb3VyY2VzOiBmdW5jdGlvbkFybnMsXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgcGVybWlzc2lvbnMgdG8gYWNjZXNzIFMzIGJ1Y2tldHMgKHJlYWQtb25seSBmb3IgZ3Vlc3RzKVxuICAgKi9cbiAgcHVibGljIGdyYW50UzNSZWFkQWNjZXNzKGJ1Y2tldEFybnM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgY29uc3QgcmVzb3VyY2VBcm5zID0gYnVja2V0QXJucy5mbGF0TWFwKChidWNrZXRBcm4pID0+IFtcbiAgICAgIGJ1Y2tldEFybixcbiAgICAgIGAke2J1Y2tldEFybn0vKmAsXG4gICAgXSk7XG5cbiAgICB0aGlzLnVuYXV0aGVudGljYXRlZFJvbGUuYWRkVG9Qb2xpY3koXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnLCAnczM6R2V0T2JqZWN0VmVyc2lvbicsICdzMzpMaXN0QnVja2V0J10sXG4gICAgICAgIHJlc291cmNlczogcmVzb3VyY2VBcm5zLFxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHBlcm1pc3Npb25zIHRvIGFjY2VzcyBBcHBTeW5jIEdyYXBoUUwgQVBJXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRBcHBTeW5jQWNjZXNzKGFwaUFybjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy51bmF1dGhlbnRpY2F0ZWRSb2xlLmFkZFRvUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFsnYXBwc3luYzpHcmFwaFFMJ10sXG4gICAgICAgIHJlc291cmNlczogW2Ake2FwaUFybn0vKmBdLFxuICAgICAgfSlcbiAgICApO1xuICB9XG59XG4iXX0=