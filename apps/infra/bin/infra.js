#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const infra_stack_1 = require("../lib/infra-stack");
const app = new cdk.App();
new infra_stack_1.InfraStack(app, 'InfraStack', {
    stackName: 'test-raintree',
    env: {
        account: '286668516152',
        region: 'us-east-1',
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5mcmEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmZyYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1Q0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLG9EQUFnRDtBQUVoRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLHdCQUFVLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRTtJQUNoQyxTQUFTLEVBQUUsZUFBZTtJQUMxQixHQUFHLEVBQUU7UUFDSCxPQUFPLEVBQUUsY0FBYztRQUN2QixNQUFNLEVBQUUsV0FBVztLQUNwQjtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAnc291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbmZyYVN0YWNrIH0gZnJvbSAnLi4vbGliL2luZnJhLXN0YWNrJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBJbmZyYVN0YWNrKGFwcCwgJ0luZnJhU3RhY2snLCB7XG4gIHN0YWNrTmFtZTogJ3Rlc3QtcmFpbnRyZWUnLFxuICBlbnY6IHtcbiAgICBhY2NvdW50OiAnMjg2NjY4NTE2MTUyJyxcbiAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICB9LFxufSk7XG4iXX0=