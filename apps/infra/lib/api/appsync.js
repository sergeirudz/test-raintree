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
    api.createResolver('getWeightResolver', {
        typeName: 'Query',
        fieldName: 'getWeight',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'queries/getWeight.js')),
    });
    // Add Mutation resolvers
    api.createResolver('createUserResolver', {
        typeName: 'Mutation',
        fieldName: 'createUser',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'mutations/createUser.js')),
    });
    api.createResolver('createWeightResolver', {
        typeName: 'Mutation',
        fieldName: 'createWeight',
        dataSource: appDataSource,
        runtime: aws_appsync_1.FunctionRuntime.JS_1_0_0,
        code: aws_appsync_1.Code.fromAsset(path.join(resolverPath, 'mutations/createWeight.js')),
    });
    return api;
};
exports.createAppSyncAPI = createAppSyncAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcHN5bmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseURBT2lDO0FBR2pDLDZCQUE2QjtBQU83QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUMxQixTQUFTLEVBQ1QsNkNBQTZDLENBQzlDLENBQUM7QUFFRixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUM1QixTQUFTLEVBQ1QsOENBQThDLENBQy9DLENBQUM7QUFFSyxNQUFNLGdCQUFnQixHQUFHLENBQUMsS0FBZ0IsRUFBRSxLQUFzQixFQUFFLEVBQUU7SUFDM0UsTUFBTSxHQUFHLEdBQUcsSUFBSSx3QkFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQy9DLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTztRQUNuQixVQUFVLEVBQUUsd0JBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQzNDLG1CQUFtQixFQUFFO1lBQ25CLG9CQUFvQixFQUFFO2dCQUNwQixpQkFBaUIsRUFBRSwrQkFBaUIsQ0FBQyxPQUFPO2FBQzdDO1NBQ0Y7UUFDRCxTQUFTLEVBQUU7WUFDVCxhQUFhLEVBQUUsMkJBQWEsQ0FBQyxHQUFHO1NBQ2pDO1FBQ0QsV0FBVyxFQUFFLElBQUk7S0FDbEIsQ0FBQyxDQUFDO0lBRUgsOEJBQThCO0lBQzlCLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTlFLHNCQUFzQjtJQUN0QixHQUFHLENBQUMsY0FBYyxDQUFDLGlCQUFpQixFQUFFO1FBQ3BDLFFBQVEsRUFBRSxPQUFPO1FBQ2pCLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFVBQVUsRUFBRSxhQUFhO1FBQ3pCLE9BQU8sRUFBRSw2QkFBZSxDQUFDLFFBQVE7UUFDakMsSUFBSSxFQUFFLGtCQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLG9CQUFvQixDQUFDLENBQUM7S0FDcEUsQ0FBQyxDQUFDO0lBRUgsR0FBRyxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsRUFBRTtRQUN0QyxRQUFRLEVBQUUsT0FBTztRQUNqQixTQUFTLEVBQUUsV0FBVztRQUN0QixVQUFVLEVBQUUsYUFBYTtRQUN6QixPQUFPLEVBQUUsNkJBQWUsQ0FBQyxRQUFRO1FBQ2pDLElBQUksRUFBRSxrQkFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0tBQ3RFLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUU7UUFDdEMsUUFBUSxFQUFFLE9BQU87UUFDakIsU0FBUyxFQUFFLFdBQVc7UUFDdEIsVUFBVSxFQUFFLGFBQWE7UUFDekIsT0FBTyxFQUFFLDZCQUFlLENBQUMsUUFBUTtRQUNqQyxJQUFJLEVBQUUsa0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztLQUN0RSxDQUFDLENBQUM7SUFFSCx5QkFBeUI7SUFDekIsR0FBRyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsRUFBRTtRQUN2QyxRQUFRLEVBQUUsVUFBVTtRQUNwQixTQUFTLEVBQUUsWUFBWTtRQUN2QixVQUFVLEVBQUUsYUFBYTtRQUN6QixPQUFPLEVBQUUsNkJBQWUsQ0FBQyxRQUFRO1FBQ2pDLElBQUksRUFBRSxrQkFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0tBQ3pFLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxjQUFjLENBQUMsc0JBQXNCLEVBQUU7UUFDekMsUUFBUSxFQUFFLFVBQVU7UUFDcEIsU0FBUyxFQUFFLGNBQWM7UUFDekIsVUFBVSxFQUFFLGFBQWE7UUFDekIsT0FBTyxFQUFFLDZCQUFlLENBQUMsUUFBUTtRQUNqQyxJQUFJLEVBQUUsa0JBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztLQUMzRSxDQUFDLENBQUM7SUFFSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQTdEVyxRQUFBLGdCQUFnQixvQkE2RDNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQXV0aG9yaXphdGlvblR5cGUsXG4gIERlZmluaXRpb24sXG4gIEZpZWxkTG9nTGV2ZWwsXG4gIEdyYXBocWxBcGksXG4gIEZ1bmN0aW9uUnVudGltZSxcbiAgQ29kZSxcbn0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwcHN5bmMnO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG50eXBlIEFwcFN5bmNBUElQcm9wcyA9IHtcbiAgYXBpTmFtZTogc3RyaW5nO1xuICBkYXRhVGFibGU6IFRhYmxlOyAvLyBTaW5nbGUgdGFibGUgZm9yIGJvdGggZW50aXRpZXNcbn07XG5cbmNvbnN0IHNjaGVtYVBhdGggPSBwYXRoLmpvaW4oXG4gIF9fZGlybmFtZSxcbiAgJy4uLy4uLy4uLy4uL3BhY2thZ2VzL2dyYXBocWwvc2NoZW1hLmdyYXBocWwnXG4pO1xuXG5jb25zdCByZXNvbHZlclBhdGggPSBwYXRoLmpvaW4oXG4gIF9fZGlybmFtZSxcbiAgJy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FwcHN5bmMtcmVzb2x2ZXJzL2J1aWxkJ1xuKTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUFwcFN5bmNBUEkgPSAoc2NvcGU6IENvbnN0cnVjdCwgcHJvcHM6IEFwcFN5bmNBUElQcm9wcykgPT4ge1xuICBjb25zdCBhcGkgPSBuZXcgR3JhcGhxbEFwaShzY29wZSwgcHJvcHMuYXBpTmFtZSwge1xuICAgIG5hbWU6IHByb3BzLmFwaU5hbWUsXG4gICAgZGVmaW5pdGlvbjogRGVmaW5pdGlvbi5mcm9tRmlsZShzY2hlbWFQYXRoKSxcbiAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQVBJX0tFWSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBsb2dDb25maWc6IHtcbiAgICAgIGZpZWxkTG9nTGV2ZWw6IEZpZWxkTG9nTGV2ZWwuQUxMLFxuICAgIH0sXG4gICAgeHJheUVuYWJsZWQ6IHRydWUsXG4gIH0pO1xuXG4gIC8vIEFkZCB0aGUgRHluYW1vREIgZGF0YXNvdXJjZVxuICBjb25zdCBhcHBEYXRhU291cmNlID0gYXBpLmFkZER5bmFtb0RiRGF0YVNvdXJjZSgnQXBwRGF0YURTJywgcHJvcHMuZGF0YVRhYmxlKTtcblxuICAvLyBBZGQgUXVlcnkgcmVzb2x2ZXJzXG4gIGFwaS5jcmVhdGVSZXNvbHZlcignZ2V0VXNlclJlc29sdmVyJywge1xuICAgIHR5cGVOYW1lOiAnUXVlcnknLFxuICAgIGZpZWxkTmFtZTogJ2dldFVzZXInLFxuICAgIGRhdGFTb3VyY2U6IGFwcERhdGFTb3VyY2UsXG4gICAgcnVudGltZTogRnVuY3Rpb25SdW50aW1lLkpTXzFfMF8wLFxuICAgIGNvZGU6IENvZGUuZnJvbUFzc2V0KHBhdGguam9pbihyZXNvbHZlclBhdGgsICdxdWVyaWVzL2dldFVzZXIuanMnKSksXG4gIH0pO1xuXG4gIGFwaS5jcmVhdGVSZXNvbHZlcignbGlzdFVzZXJzUmVzb2x2ZXInLCB7XG4gICAgdHlwZU5hbWU6ICdRdWVyeScsXG4gICAgZmllbGROYW1lOiAnbGlzdFVzZXJzJyxcbiAgICBkYXRhU291cmNlOiBhcHBEYXRhU291cmNlLFxuICAgIHJ1bnRpbWU6IEZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChwYXRoLmpvaW4ocmVzb2x2ZXJQYXRoLCAncXVlcmllcy9saXN0VXNlcnMuanMnKSksXG4gIH0pO1xuXG4gIGFwaS5jcmVhdGVSZXNvbHZlcignZ2V0V2VpZ2h0UmVzb2x2ZXInLCB7XG4gICAgdHlwZU5hbWU6ICdRdWVyeScsXG4gICAgZmllbGROYW1lOiAnZ2V0V2VpZ2h0JyxcbiAgICBkYXRhU291cmNlOiBhcHBEYXRhU291cmNlLFxuICAgIHJ1bnRpbWU6IEZ1bmN0aW9uUnVudGltZS5KU18xXzBfMCxcbiAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChwYXRoLmpvaW4ocmVzb2x2ZXJQYXRoLCAncXVlcmllcy9nZXRXZWlnaHQuanMnKSksXG4gIH0pO1xuXG4gIC8vIEFkZCBNdXRhdGlvbiByZXNvbHZlcnNcbiAgYXBpLmNyZWF0ZVJlc29sdmVyKCdjcmVhdGVVc2VyUmVzb2x2ZXInLCB7XG4gICAgdHlwZU5hbWU6ICdNdXRhdGlvbicsXG4gICAgZmllbGROYW1lOiAnY3JlYXRlVXNlcicsXG4gICAgZGF0YVNvdXJjZTogYXBwRGF0YVNvdXJjZSxcbiAgICBydW50aW1lOiBGdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgY29kZTogQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKHJlc29sdmVyUGF0aCwgJ211dGF0aW9ucy9jcmVhdGVVc2VyLmpzJykpLFxuICB9KTtcblxuICBhcGkuY3JlYXRlUmVzb2x2ZXIoJ2NyZWF0ZVdlaWdodFJlc29sdmVyJywge1xuICAgIHR5cGVOYW1lOiAnTXV0YXRpb24nLFxuICAgIGZpZWxkTmFtZTogJ2NyZWF0ZVdlaWdodCcsXG4gICAgZGF0YVNvdXJjZTogYXBwRGF0YVNvdXJjZSxcbiAgICBydW50aW1lOiBGdW5jdGlvblJ1bnRpbWUuSlNfMV8wXzAsXG4gICAgY29kZTogQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKHJlc29sdmVyUGF0aCwgJ211dGF0aW9ucy9jcmVhdGVXZWlnaHQuanMnKSksXG4gIH0pO1xuXG4gIHJldHVybiBhcGk7XG59O1xuIl19