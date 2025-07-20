import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, deleteUser } from '@repo/graphql/codegen/mutations';
import { listUsers, getUser } from '@repo/graphql/codegen/queries';
import { graphqlClient } from '../../../lib/graphql-client';
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserConnection,
} from '@repo/graphql/codegen/API';

export const usersQueryKey = () => ['users'] as const;
export const userQueryKey = (userId: string) => ['users', userId] as const;

/*
 * Create User Mutation
 */
/* 
TODO: when user is created invalidate useListUsersQuery key
*/
export const createUserMutationKey = ['create-user'] as const;

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: createUserMutationKey,
    mutationFn: async (data: CreateUserInput): Promise<User> => {
      const response = await graphqlClient.graphql({
        query: createUser,
        variables: {
          input: {
            name: data.name,
          },
        },
        authMode: 'apiKey',
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      return response.data?.createUser as User;
    },
    onSuccess: (newUser: User) => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey() });

      queryClient.setQueryData(userQueryKey(newUser.id), newUser);
    },
    onError: (error: Error) => {
      console.error('Failed to create user:', error);
    },
  });
};

/*
 * Update User Mutation
 */
export const updateUserMutationKey = ['update-user'] as const;

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateUserMutationKey,
    mutationFn: async (data: UpdateUserInput): Promise<User> => {
      const response = await graphqlClient.graphql({
        query: updateUser,
        variables: {
          input: data,
        },
        authMode: 'apiKey',
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      return response.data?.updateUser as User;
    },
    onSuccess: (updatedUser: User) => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey() });
      queryClient.invalidateQueries({ queryKey: userQueryKey(updatedUser.id) });
      queryClient.setQueryData(userQueryKey(updatedUser.id), updatedUser);
    },
    onError: (error: Error) => {
      console.error('Failed to update user:', error);
    },
  });
};

/*
 * List Users Query
 */
export const useListUsersQuery = (options?: {
  limit?: number;
  nextToken?: string;
}) => {
  return useQuery({
    queryKey: [...usersQueryKey(), options],
    queryFn: async (): Promise<UserConnection> => {
      const response = await graphqlClient.graphql({
        query: listUsers,
        variables: {
          limit: options?.limit || 20,
          nextToken: options?.nextToken,
        },
        authMode: 'apiKey',
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      return {
        __typename: 'UserConnection' as const,
        items: (response.data?.listUsers?.items || []) as User[],
        nextToken: response.data?.listUsers?.nextToken || undefined,
      };
    },
  });
};

/*
 * Get User Query
 */
export const useGetUserQuery = (userId: string) => {
  return useQuery({
    queryKey: userQueryKey(userId),
    queryFn: async (): Promise<User> => {
      const response = await graphqlClient.graphql({
        query: getUser,
        variables: {
          userId: userId,
        },
        authMode: 'apiKey',
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      if (!response.data?.getUser) {
        throw new Error('User not found');
      }

      return response.data.getUser as User;
    },
    enabled: !!userId,
  });
};

/*
 * Delete User Mutation
 */
export const deleteUserMutationKey = ['delete-user'] as const;

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: deleteUserMutationKey,
    mutationFn: async (data: { userId: string }): Promise<boolean> => {
      const response = await graphqlClient.graphql({
        query: deleteUser,
        variables: {
          userId: data.userId,
        },
        authMode: 'apiKey',
      });

      if (response.errors) {
        throw new Error(response.errors[0]?.message || 'GraphQL error');
      }

      return response.data?.deleteUser as boolean;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey() });
    },
    onError: (error: Error) => {
      console.error('Failed to delete user:', error);
    },
  });
};
