"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = void 0;
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const createTable = (scope, props) => {
    const table = new aws_dynamodb_1.Table(scope, props.tableName, {
        billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
            name: '__typename',
            type: aws_dynamodb_1.AttributeType.STRING,
        },
        sortKey: {
            name: 'id',
            type: aws_dynamodb_1.AttributeType.STRING,
        },
    });
    return table;
};
exports.createTable = createTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjcmVhdGVUYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyREFBNkU7QUFPdEUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFnQixFQUFFLEtBQWlCLEVBQUUsRUFBRTtJQUNqRSxNQUFNLEtBQUssR0FBRyxJQUFJLG9CQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUU7UUFDOUMsV0FBVyxFQUFFLDBCQUFXLENBQUMsZUFBZTtRQUN4QyxZQUFZLEVBQUU7WUFDWixJQUFJLEVBQUUsWUFBWTtZQUNsQixJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO1NBQzNCO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLElBQUk7WUFDVixJQUFJLEVBQUUsNEJBQWEsQ0FBQyxNQUFNO1NBQzNCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFiVyxRQUFBLFdBQVcsZUFhdEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdHRyaWJ1dGVUeXBlLCBCaWxsaW5nTW9kZSwgVGFibGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbnR5cGUgVGFibGVQcm9wcyA9IHtcbiAgdGFibGVOYW1lOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlVGFibGUgPSAoc2NvcGU6IENvbnN0cnVjdCwgcHJvcHM6IFRhYmxlUHJvcHMpID0+IHtcbiAgY29uc3QgdGFibGUgPSBuZXcgVGFibGUoc2NvcGUsIHByb3BzLnRhYmxlTmFtZSwge1xuICAgIGJpbGxpbmdNb2RlOiBCaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXG4gICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICBuYW1lOiAnX190eXBlbmFtZScsXG4gICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICB9LFxuICAgIHNvcnRLZXk6IHtcbiAgICAgIG5hbWU6ICdpZCcsXG4gICAgICB0eXBlOiBBdHRyaWJ1dGVUeXBlLlNUUklORyxcbiAgICB9LFxuICB9KTtcbiAgcmV0dXJuIHRhYmxlO1xufTtcbiJdfQ==