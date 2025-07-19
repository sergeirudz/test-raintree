import { App } from '@aws-cdk/aws-amplify-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
type AmplifyHostingProps = {
    appName: string;
    role: iam.Role;
};
export declare function createAmplifyHosting(scope: Construct, props: AmplifyHostingProps): App;
export {};
