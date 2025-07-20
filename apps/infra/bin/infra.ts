#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'InfraStack', {
  stackName: 'test-raintree', // Name how Stack is displayed in AWS
  env: {
    account: '286668516152', // AWS account ID
    region: 'us-east-1', // AWS region
  },
});
