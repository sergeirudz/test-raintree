/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUser = /* GraphQL */ `query GetUser($userId: ID!) {
  getUser(userId: $userId) {
    id
    name
    createdAt
    updatedAt
    weights {
      id
      userId
      weight
      createdAt
      updatedAt
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers($limit: Int, $nextToken: String) {
  listUsers(limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getWeight = /* GraphQL */ `query GetWeight($weightId: ID!) {
  getWeight(weightId: $weightId) {
    id
    userId
    weight
    createdAt
    updatedAt
    user {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<APITypes.GetWeightQueryVariables, APITypes.GetWeightQuery>;
export const listWeights = /* GraphQL */ `query ListWeights($limit: Int, $nextToken: String) {
  listWeights(limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      weight
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWeightsQueryVariables,
  APITypes.ListWeightsQuery
>;
export const listWeightsByUser = /* GraphQL */ `query ListWeightsByUser($userId: ID!, $limit: Int, $nextToken: String) {
  listWeightsByUser(userId: $userId, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      weight
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWeightsByUserQueryVariables,
  APITypes.ListWeightsByUserQuery
>;
