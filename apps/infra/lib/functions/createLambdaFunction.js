"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLambdaFunction = void 0;
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const createLambdaFunction = (scope, props) => {
    return new aws_lambda_1.Function(scope, props.functionName, {
        runtime: aws_lambda_1.Runtime.NODEJS_18_X,
        handler: props.handler,
        code: aws_lambda_1.Code.fromAsset(props.codePath),
        timeout: aws_cdk_lib_1.Duration.seconds(30),
        memorySize: 256,
    });
};
exports.createLambdaFunction = createLambdaFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlTGFtYmRhRnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjcmVhdGVMYW1iZGFGdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1REFBaUU7QUFDakUsNkNBQXVDO0FBU2hDLE1BQU0sb0JBQW9CLEdBQUcsQ0FDbEMsS0FBZ0IsRUFDaEIsS0FBZ0MsRUFDaEMsRUFBRTtJQUNGLE9BQU8sSUFBSSxxQkFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsWUFBWSxFQUFFO1FBQzdDLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7UUFDNUIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1FBQ3RCLElBQUksRUFBRSxpQkFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQ3BDLE9BQU8sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDN0IsVUFBVSxFQUFFLEdBQUc7S0FDaEIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBWFcsUUFBQSxvQkFBb0Isd0JBVy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRnVuY3Rpb24sIFJ1bnRpbWUsIENvZGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmludGVyZmFjZSBDcmVhdGVMYW1iZGFGdW5jdGlvblByb3BzIHtcbiAgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG4gIGhhbmRsZXI6IHN0cmluZztcbiAgY29kZVBhdGg6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxhbWJkYUZ1bmN0aW9uID0gKFxuICBzY29wZTogQ29uc3RydWN0LFxuICBwcm9wczogQ3JlYXRlTGFtYmRhRnVuY3Rpb25Qcm9wc1xuKSA9PiB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb24oc2NvcGUsIHByb3BzLmZ1bmN0aW9uTmFtZSwge1xuICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgaGFuZGxlcjogcHJvcHMuaGFuZGxlcixcbiAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChwcm9wcy5jb2RlUGF0aCksXG4gICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgbWVtb3J5U2l6ZTogMjU2LFxuICB9KTtcbn07XG4iXX0=