"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppSyncAPI = void 0;
const aws_appsync_1 = require("aws-cdk-lib/aws-appsync");
const path = require("path");
const schemaPath = path.join(__dirname, '../../../../packages/graphql/schema.graphql');
const resolverPath = path.join(__dirname, '../../../../packages/appsync-resolvers/build');
const createAppSyncAPI = (scope, props) => {
    const api = new aws_appsync_1.GraphqlApi(scope, props.apiName, {
        name: props.apiName,
        definition: aws_appsync_1.Definition.fromFile(schemaPath),
        authorizationConfig: {
            defaultAuthorization: {
                authorizationType: aws_appsync_1.AuthorizationType.API_KEY,
            },
        },
        logConfig: {
            fieldLogLevel: aws_appsync_1.FieldLogLevel.ALL,
        },
        xrayEnabled: true,
    });
    // Add the DynamoDB datasource
    const appDataSource = api.addDynamoDbDataSource('AppDataDS', props.dataTable);
    // Add Query resolvers
    api.createResolver('getUserResolver', {
        typeName: 'Query',
        fieldName: 'getUser',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'queries/getUser.js')),
    });
    api.createResolver('listUsersResolver', {
        typeName: 'Query',
        fieldName: 'listUsers',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'queries/listUsers.js')),
    });
    api.createResolver('listWeightsByUserResolver', {
        typeName: 'Query',
        fieldName: 'listWeightsByUser',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'queries/listWeightsByUser.js')),
    });
    // Add Mutation resolvers
    api.createResolver('createUserResolver', {
        typeName: 'Mutation',
        fieldName: 'createUser',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'mutations/createUser.js')),
    });
    api.createResolver('updateUserResolver', {
        typeName: 'Mutation',
        fieldName: 'updateUser',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'mutations/updateUser.js')),
    });
    api.createResolver('deleteUserResolver', {
        typeName: 'Mutation',
        fieldName: 'deleteUser',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'mutations/deleteUser.js')),
    });
    api.createResolver('createWeightResolver', {
        typeName: 'Mutation',
        fieldName: 'createWeight',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'mutations/createWeight.js')),
    });
    api.createResolver('updateWeightResolver', {
        typeName: 'Mutation',
        fieldName: 'updateWeight',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'mutations/updateWeight.js')),
    });
    api.createResolver('deleteWeightResolver', {
        typeName: 'Mutation',
        fieldName: 'deleteWeight',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'mutations/deleteWeight.js')),
    });
    // Add Field resolvers
    api.createResolver('userWeightsFieldResolver', {
        typeName: 'User',
        fieldName: 'weights',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'fieldResolvers/User.weights.js')),
    });
    return api;
};
exports.createAppSyncAPI = createAppSyncAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcHN5bmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseURBT2lDO0FBR2pDLDZCQUE2QjtBQU83QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUMxQixTQUFTLEVBQ1QsNkNBQTZDLENBQzlDLENBQUM7QUFFRixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUM1QixTQUFTLEVBQ1QsOENBQThDLENBQy9DLENBQUM7QUFFSyxNQUFNLGdCQUFnQixHQUFHLENBQUMsS0FBZ0IsRUFBRSxLQUFzQixFQUFFLEVBQUU7SUFDM0UsTUFBTSxHQUFHLEdBQUcsSUFBSSx3QkFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQy9DLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTztRQUNuQixVQUFVLEVBQUUsd0JBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQzNDLG1CQUFtQixFQUFFO1lBQ25CLG9CQUFvQixFQUFFO2dCQUNwQixpQkFBaUIsRUFBRSwrQkFBaUIsQ0FBQyxPQUFPO2FBQzdDO1NBQ0Y7UUFDRCxTQUFTLEVBQUU7WUFDVCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxHQUFHO1NBQ2pDO1FBQ0QsV0FBVyxFQUFFLElBQUk7S0FDbEIsQ0FBQyxDQUFDO0lBRUgsOEJBQThCO0lBQzlCLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTlFLHNCQUFzQjtJQUN0QixHQUFHLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFFO1FBQ3BDLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFVBQVUsRUFBRSxhQUFhO1FBQ3pCLE9BQU8sRUFBRSw2QkFBZSxDQUFDLFFBQVE7UUFDakMsSUFBSSxFQUFFLGtCQUFJLENBQUMsU0FB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RUFBRSxhQUFhO1FBQ3pCLE9BQU8sRUFBRSw2QkFBZSxDQUFDLFFBQVE7UUFDakMsSUFBSSxFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLDJCQUEyQixDQUFDLENBQUM7S0FDM0UsQ0FBQyxDQUFDO0lBRUgsc0JBQXNCO0lBQ3RCLEdBQUcsQ0FBQyxjQUFjLENBQUMsMEJBQTBCLEVBQUU7UUFDN0MsUUFBUSxFQUFFLE1BQU07UUFDaEIsU0FBUyxFQUFFLFNBQVM7UUFDcEIsVUFBVSxFQUFFLGFBQWE7UUFDekIsT0FBTyxFQUFFLDZCQUFlLENBQUMsUUFBUTtRQUNqQyxJQUFJLEVBQUUsa0JBQUksQ0FBQyxTQUFTLENBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLGdDQUFnQyxDQUFDLENBQzFEO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUExR1csUUFBQSxnQkFBZ0Isb0JBMEczQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEF1dGhvcml6YXRpb25UeXBlLFxuICBEZWZpbml0aW9uLFxuICBGaWVsZExvZ0xldmVsLFxuICBHcmFwaHFsQXBpLFxuICBGdW5jdGlvblJ1bnRpbWUsXG4gIENvZGUsXG59IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcHBzeW5jJztcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcblxudHlwZSBBcHBTeW5jQVBJUHJvcHMgPSB7XG4gIGFwaU5hbWU6IHN0cmluZztcbiAgZGF0YVRhYmxlOiBUYWJsZTsgLy8gU2luZ2xlIHRhYmxlIGZvciBib3RoIGVudGl0aWVzXG59O1xuXG5jb25zdCBzY2hlbWFQYXRoID0gcGF0aC5qb2luKFxuICBfX2Rpcm5hbWUsXG4gICcuLi8uLi8uLi8uLi9wYWNrYWdlcy9ncmFwaHFsL3NjaGVtYS5ncmFwaHFsJ1xuKTtcblxuY29uc3QgcmVzb2x2ZXJQYXRoID0gcGF0aC5qb2luKFxuICBfX2Rpcm5hbWUsXG4gICcuLi8uLi8uLi8uLi9wYWNrYWdlcy9hcHBzeW5jLXJlc29sdmVycy9idWlsZCdcbik7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVBcHBTeW5jQVBJID0gKHNjb3BlOiBDb25zdHJ1Y3QsIHByb3BzOiBBcHBTeW5jQVBJUHJvcHMpID0+IHtcbiAgY29uc3QgYXBpID0gbmV3IEdyYXBocWxBcGkoc2NvcGUsIHByb3BzLmFwaU5hbWUsIHtcbiAgICBuYW1lOiBwcm9wcy5hcGlOYW1lLFxuICAgIGRlZmluaXRpb246IERlZmluaXRpb24uZnJvbUZpbGUoc2NoZW1hUGF0aCksXG4gICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVksXG4gICAgICB9LFxuICAgIH0sXG4gICAgbG9nQ29uZmlnOiB7XG4gICAgICBmaWVsZExvZ0xldmVsOiBGaWVsZExvZ0xldmVsLkFMTCxcbiAgICB9LFxuICAgIHhyYXlFbmFibGVkOiB0cnVlLFxuICB9KTtcblxuICAvLyBBZGQgdGhlIER5bmFtb0RCIGRhdGFzb3VyY2VcbiAgY29uc3QgYXBwRGF0YVNvdXJjZSA9IGFwaS5hZGREeW5hbW9EYkRhdGFTb3VyY2UoJ0FwcERhdGFEUycsIHByb3BzLmRhdGFUYWJsZSk7XG5cbiAgLy8gQWRkIFF1ZXJ5IHJlc29sdmVyc1xuICBhcGkuY3JlYXRlUmVzb2x2ZXIoJ2dldFVzZXJSZXNvbHZlcicsIHtcbiAgICB0eXBlTmFtZTogJ1F1ZXJ5JyxcbiAgICBmaWVsZE5hbWU6ICdnZXRVc2VyJyxcbiAgICBkYXRhU291cmNlOiBhcHBEYXRhU291cmNlLFxuICAgIHJ1bnRpbWU6IEZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChwYXRoLmpvaW4ocmVzb2x2ZXJQYXRoLCAncXVlcmllcy9nZXRVc2VyLmpzJykpLFxuICB9KTtcblxuICBhcGkuY3JlYXRlUmVzb2x2ZXIoJ2xpc3RVc2Vyc1Jlc29sdmVyJywge1xuICAgIHR5cGVOYW1lOiAnUXVlcnknLFxuICAgIGZpZWxkTmFtZTogJ2xpc3RVc2VycycsXG4gICAgZGF0YVNvdXJjZTogYXBwRGF0YVNvdXJjZSxcbiAgICBydW50aW1lOiBGdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgY29kZTogQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKHJlc29sdmVyUGF0aCwgJ3F1ZXJpZXMvbGlzdFVzZXJzLmpzJykpLFxuICB9KTtcblxuICBhcGkuY3JlYXRlUmVzb2x2ZXIoJ2xpc3RXZWlnaHRzQnlVc2VyUmVzb2x2ZXInLCB7XG4gICAgdHlwZU5hbWU6ICdRdWVyeScsXG4gICAgZmllbGROYW1lOiAnbGlzdFdlaWdodHNCeVVzZXInLFxuICAgIGRhdGFTb3VyY2U6IGFwcERhdGFTb3VyY2UsXG4gICAgcnVudGltZTogRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIGNvZGU6IENvZGUuZnJvbUFzc2V0KFxuICAgICAgcGF0aC5qb2luKHJlc29sdmVyUGF0aCwgJ3F1ZXJpZXMvbGlzdFdlaWdodHNCeVVzZXIuanMnKVxuICAgICksXG4gIH0pO1xuXG4gIC8vIEFkZCBNdXRhdGlvbiByZXNvbHZlcnNcbiAgYXBpLmNyZWF0ZVJlc29sdmVyKCdjcmVhdGVVc2VyUmVzb2x2ZXInLCB7XG4gICAgdHlwZU5hbWU6ICdNdXRhdGlvbicsXG4gICAgZmllbGROYW1lOiAnY3JlYXRlVXNlcicsXG4gICAgZGF0YVNvdXJjZTogYXBwRGF0YVNvdXJjZSxcbiAgICBydW50aW1lOiBGdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgY29kZTogQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKHJlc29sdmVyUGF0aCwgJ211dGF0aW9ucy9jcmVhdGVVc2VyLmpzJykpLFxuICB9KTtcblxuICBhcGkuY3JlYXRlUmVzb2x2ZXIoJ3VwZGF0ZVVzZXJSZXNvbHZlcicsIHtcbiAgICB0eXBlTmFtZTogJ011dGF0aW9uJyxcbiAgICBmaWVsZE5hbWU6ICd1cGRhdGVVc2VyJyxcbiAgICBkYXRhU291cmNlOiBhcHBEYXRhU291cmNlLFxuICAgIHJ1bnRpbWU6IEZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChwYXRoLmpvaW4ocmVzb2x2ZXJQYXRoLCAnbXV0YXRpb25zL3VwZGF0ZVVzZXIuanMnKSksXG4gIH0pO1xuXG4gIGFwaS5jcmVhdGVSZXNvbHZlcignZGVsZXRlVXNlclJlc29sdmVyJywge1xuICAgIHR5cGVOYW1lOiAnTXV0YXRpb24nLFxuICAgIGZpZWxkTmFtZTogJ2RlbGV0ZVVzZXInLFxuICAgIGRhdGFTb3VyY2U6IGFwcERhdGFTb3VyY2UsXG4gICAgcnVudGltZTogRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIGNvZGU6IENvZGUuZnJvbUFzc2V0KHBhdGguam9pbihyZXNvbHZlclBhdGgsICdtdXRhdGlvbnMvZGVsZXRlVXNlci5qcycpKSxcbiAgfSk7XG5cbiAgYXBpLmNyZWF0ZVJlc29sdmVyKCdjcmVhdGVXZWlnaHRSZXNvbHZlcicsIHtcbiAgICB0eXBlTmFtZTogJ011dGF0aW9uJyxcbiAgICBmaWVsZE5hbWU6ICdjcmVhdGVXZWlnaHQnLFxuICAgIGRhdGFTb3VyY2U6IGFwcERhdGFTb3VyY2UsXG4gICAgcnVudGltZTogRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIGNvZGU6IENvZGUuZnJvbUFzc2V0KHBhdGguam9pbihyZXNvbHZlclBhdGgsICdtdXRhdGlvbnMvY3JlYXRlV2VpZ2h0LmpzJykpLFxuICB9KTtcblxuICBhcGkuY3JlYXRlUmVzb2x2ZXIoJ3VwZGF0ZVdlaWdodFJlc29sdmVyJywge1xuICAgIHR5cGVOYW1lOiAnTXV0YXRpb24nLFxuICAgIGZpZWxkTmFtZTogJ3VwZGF0ZVdlaWdodCcsXG4gICAgZGF0YVNvdXJjZTogYXBwRGF0YVNvdXJjZSxcbiAgICBydW50aW1lOiBGdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgY29kZTogQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKHJlc29sdmVyUGF0aCwgJ211dGF0aW9ucy91cGRhdGVXZWlnaHQuanMnKSksXG4gIH0pO1xuXG4gIGFwaS5jcmVhdGVSZXNvbHZlcignZGVsZXRlV2VpZ2h0UmVzb2x2ZXInLCB7XG4gICAgdHlwZU5hbWU6ICdNdXRhdGlvbicsXG4gICAgZmllbGROYW1lOiAnZGVsZXRlV2VpZ2h0JyxcbiAgICBkYXRhU291cmNlOiBhcHBEYXRhU291cmNlLFxuICAgIHJ1bnRpbWU6IEZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChwYXRoLmpvaW4ocmVzb2x2ZXJQYXRoLCAnbXV0YXRpb25zL2RlbGV0ZVdlaWdodC5qcycpKSxcbiAgfSk7XG5cbiAgLy8gQWRkIEZpZWxkIHJlc29sdmVyc1xuICBhcGkuY3JlYXRlUmVzb2x2ZXIoJ3VzZXJXZWlnaHRzRmllbGRSZXNvbHZlcicsIHtcbiAgICB0eXBlTmFtZTogJ1VzZXInLFxuICAgIGZpZWxkTmFtZTogJ3dlaWdodHMnLFxuICAgIGRhdGFTb3VyY2U6IGFwcERhdGFTb3VyY2UsXG4gICAgcnVudGltZTogRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIGNvZGU6IENvZGUuZnJvbUFzc2V0KFxuICAgICAgcGF0aC5qb2luKHJlc29sdmVyUGF0aCwgJ2ZpZWxkUmVzb2x2ZXJzL1VzZXIud2VpZ2h0cy5qcycpXG4gICAgKSxcbiAgfSk7XG5cbiAgcmV0dXJuIGFwaTtcbn07XG4iXX0=