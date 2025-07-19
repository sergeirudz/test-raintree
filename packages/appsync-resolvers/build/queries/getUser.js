// src/queries/getUser.ts
import * as ddb from "@aws-appsync/utils/dynamodb";
import { util } from "@aws-appsync/utils";
function request(ctx) {
  return ddb.get({
    key: {
      id: ctx.args.userId
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3F1ZXJpZXMvZ2V0VXNlci50cyJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxZQUFZLFNBQVM7QUFDckIsU0FBa0IsWUFBWTtBQWF2QixTQUFTLFFBQVEsS0FBcUM7QUFDM0QsU0FBVyxRQUFJO0FBQUEsSUFDYixLQUFLO0FBQUEsTUFDSCxJQUFJLElBQUksS0FBSztBQUFBLElBQ2Y7QUFBQSxFQUNGLENBQUM7QUFDSDtBQUVPLFNBQVMsU0FBUyxLQUEyQjtBQUNsRCxNQUFJLElBQUksT0FBTztBQUNiLFNBQUssTUFBTSxJQUFJLE1BQU0sU0FBUyxJQUFJLE1BQU0sSUFBSTtBQUFBLEVBQzlDO0FBRUEsU0FBTyxJQUFJO0FBQ2I7IiwKICAibmFtZXMiOiBbXQp9Cg==
