// GraphQL Client Configuration for AppSync Integration
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;
const AWS_REGION = import.meta.env.VITE_AWS_REGION;
const COGNITO_IDENTITY_POOL_ID = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;

const amplifyConfig = {
  API: {
    GraphQL: {
      endpoint: GRAPHQL_ENDPOINT,
      region: AWS_REGION,
      defaultAuthMode: 'identityPool' as const,
    },
  },
  Auth: {
    Cognito: {
      identityPoolId: COGNITO_IDENTITY_POOL_ID,
    },
  },
};

if (GRAPHQL_ENDPOINT && AWS_REGION && COGNITO_IDENTITY_POOL_ID) {
  Amplify.configure(amplifyConfig);
} else {
  console.warn('Missing required environment variables for Amplify');
}

export const graphqlClient = generateClient();
