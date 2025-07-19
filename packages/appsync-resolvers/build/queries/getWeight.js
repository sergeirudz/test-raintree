// src/queries/getWeight.ts
import * as ddb from "@aws-appsync/utils/dynamodb";
import { util } from "@aws-appsync/utils";
function request(ctx) {
  return ddb.get({
    key: {
      id: ctx.args.weightId
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3F1ZXJpZXMvZ2V0V2VpZ2h0LnRzIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFlBQVksU0FBUztBQUNyQixTQUFrQixZQUFZO0FBY3ZCLFNBQVMsUUFBUSxLQUF1QztBQUM3RCxTQUFXLFFBQUk7QUFBQSxJQUNiLEtBQUs7QUFBQSxNQUNILElBQUksSUFBSSxLQUFLO0FBQUEsSUFDZjtBQUFBLEVBQ0YsQ0FBQztBQUNIO0FBRU8sU0FBUyxTQUFTLEtBQTZCO0FBQ3BELE1BQUksSUFBSSxPQUFPO0FBQ2IsU0FBSyxNQUFNLElBQUksTUFBTSxTQUFTLElBQUksTUFBTSxJQUFJO0FBQUEsRUFDOUM7QUFFQSxTQUFPLElBQUk7QUFDYjsiLAogICJuYW1lcyI6IFtdCn0K
