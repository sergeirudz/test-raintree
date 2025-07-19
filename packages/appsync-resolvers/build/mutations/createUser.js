// src/mutations/createUser.ts
import * as ddb from "@aws-appsync/utils/dynamodb";
import { util } from "@aws-appsync/utils";
function request(ctx) {
  const now = util.time.nowISO8601();
  const id = util.autoId();
  return ddb.put({
    key: {
      id
    },
    item: {
      id,
      __typename: "User",
      ...ctx.args.input,
      createdAt: now,
      updatedAt: now
    }
  });
}
function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result;
}
export {
  request,
  response
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL211dGF0aW9ucy9jcmVhdGVVc2VyLnRzIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFlBQVksU0FBUztBQUNyQixTQUFrQixZQUFZO0FBaUJ2QixTQUFTLFFBQVEsS0FBMkM7QUFDakUsUUFBTSxNQUFNLEtBQUssS0FBSyxXQUFXO0FBQ2pDLFFBQU0sS0FBSyxLQUFLLE9BQU87QUFFdkIsU0FBVyxRQUFJO0FBQUEsSUFDYixLQUFLO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKO0FBQUEsTUFDQSxZQUFZO0FBQUEsTUFDWixHQUFHLElBQUksS0FBSztBQUFBLE1BQ1osV0FBVztBQUFBLE1BQ1gsV0FBVztBQUFBLElBQ2I7QUFBQSxFQUNGLENBQUM7QUFDSDtBQUVPLFNBQVMsU0FBUyxLQUFvQjtBQUMzQyxNQUFJLElBQUksT0FBTztBQUNiLFNBQUssTUFBTSxJQUFJLE1BQU0sU0FBUyxJQUFJLE1BQU0sSUFBSTtBQUFBLEVBQzlDO0FBRUEsU0FBTyxJQUFJO0FBQ2I7IiwKICAibmFtZXMiOiBbXQp9Cg==
