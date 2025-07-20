import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface CreateLambdaFunctionProps {
  functionName: string;
  handler: string;
  codePath: string;
}

export const createLambdaFunction = (
  scope: Construct,
  props: CreateLambdaFunctionProps
) => {
  return new Function(scope, props.functionName, {
    runtime: Runtime.NODEJS_18_X,
    handler: props.handler,
    code: Code.fromAsset(props.codePath),
    timeout: Duration.seconds(30),
    memorySize: 256,
  });
};
