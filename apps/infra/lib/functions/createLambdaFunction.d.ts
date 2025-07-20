import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
interface CreateLambdaFunctionProps {
    functionName: string;
    handler: string;
    codePath: string;
}
export declare const createLambdaFunction: (scope: Construct, props: CreateLambdaFunctionProps) => Function;
export {};
