import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createWeight,
  updateWeight,
  deleteWeight,
} from '@repo/graphql/codegen/mutations';
import {
  listWeights,
  getWeight,
  listWeightsByUser,
} from '@repo/graphql/codegen/queries';
import { graphqlClient } from '../../../lib/graphql-client';
import type {
  CreateWeightInput,
  UpdateWeightInput,
  Weight,
} from '@repo/graphql/codegen/API';
import { userQueryKey } from '../../users/lib/api';

interface WeightConnection {
  items: Weight[];
  nextToken?: string;
}

export const weightsQueryKey = () => ['weights'] as const;
export const weightQueryKey = (weightId: string) =>
  ['weights', weightId] as const;
export const userWeightsQueryKey = (userId: string) =>
  ['weights', 'user', userId] as const;

/*
 * Create Weight Mutation
 */
export const createWeightMutationKey = ['create-weight'] as const;

export const useCreateWeightMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: createWeightMutationKey,
    mutationFn: async (data: CreateWeightInput): Promise<Weight> => {
      const response = await graphqlClient.graphql({
        query: createWeight,
        variables: {
          input: {
            userId: data.userId,
            weight: data.weight,
            date: data.date,
          },
        },
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      return response.data?.createWeight as Weight;
    },
    onSuccess: (newWeight: Weight) => {
      queryClient.invalidateQueries({ queryKey: weightsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: userWeightsQueryKey(newWeight.userId),
      });
      queryClient.invalidateQueries({
        queryKey: userQueryKey(newWeight.userId),
      });
      queryClient.setQueryData(weightQueryKey(newWeight.id), newWeight);
    },
    onError: (error: Error) => {
      console.error('Failed to create weight:', error);
    },
  });
};

/*
 * Update Weight Mutation
 */
export const updateWeightMutationKey = ['update-weight'] as const;

export const useUpdateWeightMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateWeightMutationKey,
    mutationFn: async (data: UpdateWeightInput): Promise<Weight> => {
      const response = await graphqlClient.graphql({
        query: updateWeight,
        variables: {
          input: data,
        },
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      return response.data?.updateWeight as Weight;
    },
    onSuccess: (updatedWeight: Weight) => {
      queryClient.invalidateQueries({ queryKey: weightsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: userWeightsQueryKey(updatedWeight.userId),
      });
      queryClient.invalidateQueries({
        queryKey: userQueryKey(updatedWeight.userId),
      });
      queryClient.setQueryData(weightQueryKey(updatedWeight.id), updatedWeight);
    },
    onError: (error: Error) => {
      console.error('Failed to update weight:', error);
    },
  });
};

/*
 * Delete Weight Mutation
 */
export const deleteWeightMutationKey = ['delete-weight'] as const;

export const useDeleteWeightMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: deleteWeightMutationKey,
    mutationFn: async ({
      weightId,
    }: {
      weightId: string;
      userId: string;
    }): Promise<boolean> => {
      const response = await graphqlClient.graphql({
        query: deleteWeight,
        variables: {
          weightId: weightId,
        },
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      return response.data?.deleteWeight || false;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: weightsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: userWeightsQueryKey(userId),
      });
      queryClient.invalidateQueries({
        queryKey: userQueryKey(userId),
      });
    },
    onError: (error: Error) => {
      console.error('Failed to delete weight:', error);
    },
  });
};

/*
 * List Weights Query
 */
export const useListWeightsQuery = (options?: {
  limit?: number;
  nextToken?: string;
}) => {
  return useQuery({
    queryKey: [...weightsQueryKey(), options],
    queryFn: async (): Promise<WeightConnection> => {
      const response = await graphqlClient.graphql({
        query: listWeights,
        variables: {
          limit: options?.limit || 20,
          nextToken: options?.nextToken,
        },
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      return {
        items: (response.data?.listWeights?.items || []) as Weight[],
        nextToken: response.data?.listWeights?.nextToken || undefined,
      };
    },
  });
};

/*
 * List Weights by User Query
 */
export const useListWeightsByUserQuery = (
  userId: string,
  options?: {
    limit?: number;
    nextToken?: string;
  }
) => {
  return useQuery({
    queryKey: [...userWeightsQueryKey(userId), options],
    queryFn: async (): Promise<WeightConnection> => {
      const response = await graphqlClient.graphql({
        query: listWeightsByUser,
        variables: {
          userId: userId,
          limit: options?.limit || 20,
          nextToken: options?.nextToken,
        },
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      return {
        items: (response.data?.listWeightsByUser?.items || []) as Weight[],
        nextToken: response.data?.listWeightsByUser?.nextToken || undefined,
      };
    },
    enabled: !!userId,
  });
};

/*
 * Get Weight Query
 */
export const useGetWeightQuery = (weightId: string) => {
  return useQuery({
    queryKey: weightQueryKey(weightId),
    queryFn: async (): Promise<Weight> => {
      const response = await graphqlClient.graphql({
        query: getWeight,
        variables: {
          weightId: weightId,
        },
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      if (!response.data?.getWeight) {
        throw new Error('Weight not found');
      }

      return response.data.getWeight as Weight;
    },
    enabled: !!weightId,
  });
};
