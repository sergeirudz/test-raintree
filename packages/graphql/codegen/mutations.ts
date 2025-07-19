/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUser = /* GraphQL */ `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser($userId: ID!) {
  deleteUser(userId: $userId)
}
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createWeight = /* GraphQL */ `mutation CreateWeight($input: CreateWeightInput!) {
  createWeight(input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateWeightMutationVariables,
  APITypes.CreateWeightMutation
>;
export const updateWeight = /* GraphQL */ `mutation UpdateWeight($input: UpdateWeightInput!) {
  updateWeight(input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateWeightMutationVariables,
  APITypes.UpdateWeightMutation
>;
export const deleteWeight = /* GraphQL */ `mutation DeleteWeight($weightId: ID!) {
  deleteWeight(weightId: $weightId)
}
` as GeneratedMutation<
  APITypes.DeleteWeightMutationVariables,
  APITypes.DeleteWeightMutation
>;
