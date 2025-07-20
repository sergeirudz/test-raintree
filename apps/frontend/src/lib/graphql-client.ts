// GraphQL Client Configuration for AppSync Integration
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;
const APPSYNC_API_KEY = import.meta.env.VITE_APPSYNC_API_KEY;
const APPSYNC_REGION = import.meta.env.VITE_APPSYNC_REGION;
const APPSYNC_DEFAULT_AUTH_MODE = import.meta.env
  .VITE_APPSYNC_DEFAULT_AUTH_MODE;

const amplifyConfig = {
  API: {
    GraphQL: {
      endpoint: GRAPHQL_ENDPOINT,
      region: APPSYNC_REGION,
      defaultAuthMode: APPSYNC_DEFAULT_AUTH_MODE,
      apiKey: APPSYNC_API_KEY,
    },
  },
};

if (GRAPHQL_ENDPOINT && APPSYNC_API_KEY && APPSYNC_REGION) {
  Amplify.configure(amplifyConfig);
} else {
  console.warn('Missing required environment variables for Amplify');
}

export const graphqlClient = generateClient();
