# AppSync Resolvers

Enterprise-level AppSync resolver functions for GraphQL operations.

## Structure

```
src/
├── mutations/          # GraphQL mutation resolvers
│   └── createUser.ts
├── queries/           # GraphQL query resolvers
│   └── getUser.ts
├── subscriptions/     # GraphQL subscription resolvers
└── shared/           # Shared utilities and types
    └── types.ts
```

## Development

### Build

```bash
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

### Clean

```bash
pnpm clean
```

## Adding New Resolvers

1. Create TypeScript files in the appropriate directory (`mutations/`, `queries/`, or `subscriptions/`)
2. Export `request` and `response` functions
3. Use shared types from `shared/types.ts`
4. Run `pnpm build` to compile to JavaScript

## Example Resolver

```typescript
import * as ddb from '@aws-appsync/utils/dynamodb'
import { Context, util } from '@aws-appsync/utils'

export function request(ctx: Context<Variables>) {
  return ddb.get({ key: { id: ctx.args.id } })
}

export function response(ctx: Context) {
  return ctx.result
}
```
