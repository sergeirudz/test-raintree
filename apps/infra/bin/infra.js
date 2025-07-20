#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const infra_stack_1 = require("../lib/infra-stack");
const app = new cdk.App();
new infra_stack_1.InfraStack(app, 'InfraStack', {
    stackName: 'test-raintree', // Name how Stack is displayed in AWS
    env: {
        account: '286668516152', // AWS account ID
        region: 'us-east-1', // AWS region
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLG9EQUFnRDtBQUVoRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLHdCQUFVLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRTtJQUNoQyxTQUFTLEVBQUUsZUFBZSxFQUFFLHFDQUFxQztJQUNqRSxHQUFHLEVBQUU7UUFDSCxPQUFPLEVBQUUsY0FBYyxFQUFFLGlCQUFpQjtRQUMxQyxNQUFNLEVBQUUsV0FBVyxFQUFFLGFBQWE7S0FDbkM7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW5mcmFTdGFjayB9IGZyb20gJy4uL2xpYi9pbmZyYS1zdGFjayc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgSW5mcmFTdGFjayhhcHAsICdJbmZyYVN0YWNrJywge1xuICBzdGFja05hbWU6ICd0ZXN0LXJhaW50cmVlJywgLy8gTmFtZSBob3cgU3RhY2sgaXMgZGlzcGxheWVkIGluIEFXU1xuICBlbnY6IHtcbiAgICBhY2NvdW50OiAnMjg2NjY4NTE2MTUyJywgLy8gQVdTIGFjY291bnQgSURcbiAgICByZWdpb246ICd1cy1lYXN0LTEnLCAvLyBBV1MgcmVnaW9uXG4gIH0sXG59KTtcbiJdfQ==