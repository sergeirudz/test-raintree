/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  name: string,
};

export type User = {
  __typename: "User",
  id: string,
  name: string,
  createdAt: string,
  updatedAt: string,
  weights:  Array<Weight >,
};

export type Weight = {
  __typename: "Weight",
  id: string,
  userId: string,
  weight: number,
  createdAt: string,
  updatedAt: string,
  user?: User | null,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
};

export type CreateWeightInput = {
  userId: string,
  weight: number,
};

export type UpdateWeightInput = {
  id: string,
  weight: number,
};

export type UserConnection = {
  __typename: "UserConnection",
  items:  Array<User >,
  nextToken?: string | null,
};

export type WeightConnection = {
  __typename: "WeightConnection",
  items:  Array<Weight >,
  nextToken?: string | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser:  {
    __typename: "User",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    weights:  Array< {
      __typename: "Weight",
      id: string,
      userId: string,
      weight: number,
      createdAt: string,
      updatedAt: string,
    } >,
  },
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    weights:  Array< {
      __typename: "Weight",
      id: string,
      userId: string,
      weight: number,
      createdAt: string,
      updatedAt: string,
    } >,
  },
};

export type DeleteUserMutationVariables = {
  userId: string,
};

export type DeleteUserMutation = {
  deleteUser: boolean,
};

export type CreateWeightMutationVariables = {
  input: CreateWeightInput,
};

export type CreateWeightMutation = {
  createWeight:  {
    __typename: "Weight",
    id: string,
    userId: string,
    weight: number,
    createdAt: string,
    updatedAt: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  },
};

export type UpdateWeightMutationVariables = {
  input: UpdateWeightInput,
};

export type UpdateWeightMutation = {
  updateWeight:  {
    __typename: "Weight",
    id: string,
    userId: string,
    weight: number,
    createdAt: string,
    updatedAt: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  },
};

export type DeleteWeightMutationVariables = {
  weightId: string,
};

export type DeleteWeightMutation = {
  deleteWeight: boolean,
};

export type GetUserQueryVariables = {
  userId: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    weights:  Array< {
      __typename: "Weight",
      id: string,
      userId: string,
      weight: number,
      createdAt: string,
      updatedAt: string,
    } >,
  } | null,
};

export type ListUsersQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers:  {
    __typename: "UserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  },
};

export type GetWeightQueryVariables = {
  weightId: string,
};

export type GetWeightQuery = {
  getWeight?:  {
    __typename: "Weight",
    id: string,
    userId: string,
    weight: number,
    createdAt: string,
    updatedAt: string,
    user?:  {
      __typename: "User",
      id: string,
      name: string,
      createdAt: string,
      updatedAt: string,
    } | null,
  } | null,
};

export type ListWeightsQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWeightsQuery = {
  listWeights:  {
    __typename: "WeightConnection",
    items:  Array< {
      __typename: "Weight",
      id: string,
      userId: string,
      weight: number,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  },
};

export type ListWeightsByUserQueryVariables = {
  userId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWeightsByUserQuery = {
  listWeightsByUser:  {
    __typename: "WeightConnection",
    items:  Array< {
      __typename: "Weight",
      id: string,
      userId: string,
      weight: number,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  },
};
