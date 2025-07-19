// src/mutations/createWeight.ts
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
      __typename: "Weight",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL211dGF0aW9ucy9jcmVhdGVXZWlnaHQudHMiXSwKICAibWFwcGluZ3MiOiAiO0FBQUEsWUFBWSxTQUFTO0FBQ3JCLFNBQWtCLFlBQVk7QUFtQnZCLFNBQVMsUUFBUSxLQUE2QztBQUNuRSxRQUFNLE1BQU0sS0FBSyxLQUFLLFdBQVc7QUFDakMsUUFBTSxLQUFLLEtBQUssT0FBTztBQUV2QixTQUFXLFFBQUk7QUFBQSxJQUNiLEtBQUs7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLE1BQ0o7QUFBQSxNQUNBLFlBQVk7QUFBQSxNQUNaLEdBQUcsSUFBSSxLQUFLO0FBQUEsTUFDWixXQUFXO0FBQUEsTUFDWCxXQUFXO0FBQUEsSUFDYjtBQUFBLEVBQ0YsQ0FBQztBQUNIO0FBRU8sU0FBUyxTQUFTLEtBQXNCO0FBQzdDLE1BQUksSUFBSSxPQUFPO0FBQ2IsU0FBSyxNQUFNLElBQUksTUFBTSxTQUFTLElBQUksTUFBTSxJQUFJO0FBQUEsRUFDOUM7QUFFQSxTQUFPLElBQUk7QUFDYjsiLAogICJuYW1lcyI6IFtdCn0K
