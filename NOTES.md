# Notes

## Frontend

- Tanstack form <https://tanstack.com/form/latest/docs/overview>

## Appsync

- Create resolvers <https://github.dev/focusOtter/fullstack-nextjs-cdk-starter>

## Deploy frontend

- <https://www.youtube.com/watch?v=ISNV6yfQqIA&ab_channel=FocusOtter>
- <https://youtu.be/XLkVZIS1nyg>
- <https://github.com/matootie/serverless/blob/trunk/services/client/lib/client.stack.ts>

## Deploy functions

## AWS

```graphql
# create user manually
mutation CreateUser {
  createUser(input: { name: "John Doe" }) {
    id
    name
    createdAt
    updatedAt
  }
}

# list users
query ListUsers {
  listUsers(limit: 10) {
    items {
      id
      name
      createdAt
      updatedAt
    }
    nextToken
  }
}
```
