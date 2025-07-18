#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new InfraStack(app, 'InfraStack', {
  stackName: 'test-raintree',
  env: {
    account: '286668516152',
    region: 'us-east-1',
  },
});
