import { Elysia } from "elysia";
import { habitApiController } from "./habits.api.controller";
import { notificationApiController } from "./notification.api.controller";

export const apiController = new Elysia({ prefix: "/api" })
  .use(habitApiController)
  .use(notificationApiController);