# Task

Please create a small Node.js and TypeScript application to track patient weight measurements.
The application should support CRUD operations via an API.
The frontend in React should allow for adding, editing, deleting, and displaying measurements.
Measurement consists of: id, patient_id, and weight.
The weight must be between 25.0 and 250.0 kg.
Each measurement id should be a unique identifier (UUID).
Use any UI library you like.

Super extra big bonus points if you implement the solution using serverless architecture and/or AWS.
But that's not a requirement.

Our AWS tech stack includes the following:
CloudFormation
CloudFront
Route 53
Lambda
API Gateway
AppSync (GraphQL)
RDS and DynamoDB
CloudWatch
Cognito
