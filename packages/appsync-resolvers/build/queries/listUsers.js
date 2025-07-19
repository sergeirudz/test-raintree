// src/queries/listUsers.ts
import * as ddb from "@aws-appsync/utils/dynamodb";
import { util } from "@aws-appsync/utils";
function request(ctx) {
  const { limit = 20, nextToken } = ctx.args;
  return ddb.scan({
    filter: {
      __typename: { eq: "User" }
    },
    limit,
    nextToken
  });
}
function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return {
    items: ctx.result.items,
    nextToken: ctx.result.nextToken
  };
}
export {
  request,
  response
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3F1ZXJpZXMvbGlzdFVzZXJzLnRzIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFlBQVksU0FBUztBQUNyQixTQUFrQixZQUFZO0FBbUJ2QixTQUFTLFFBQVEsS0FBdUM7QUFDN0QsUUFBTSxFQUFFLFFBQVEsSUFBSSxVQUFVLElBQUksSUFBSTtBQUV0QyxTQUFXLFNBQUs7QUFBQSxJQUNkLFFBQVE7QUFBQSxNQUNOLFlBQVksRUFBRSxJQUFJLE9BQU87QUFBQSxJQUMzQjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRixDQUFDO0FBQ0g7QUFFTyxTQUFTLFNBQVMsS0FBOEI7QUFDckQsTUFBSSxJQUFJLE9BQU87QUFDYixTQUFLLE1BQU0sSUFBSSxNQUFNLFNBQVMsSUFBSSxNQUFNLElBQUk7QUFBQSxFQUM5QztBQUVBLFNBQU87QUFBQSxJQUNMLE9BQU8sSUFBSSxPQUFPO0FBQUEsSUFDbEIsV0FBVyxJQUFJLE9BQU87QUFBQSxFQUN4QjtBQUNGOyIsCiAgIm5hbWVzIjogW10KfQo=
