import { App } from '@aws-cdk/aws-amplify-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CognitoAuth } from '../auth';
type AmplifyHostingProps = {
    appName: string;
    role: iam.Role;
    cognitoAuth?: CognitoAuth;
};
export declare function createAmplifyHosting(scope: Construct, props: AmplifyHostingProps): App;
export {};
