import { Elysia } from "elysia";
import { sessionUserMiddleware } from "../../middlewares/auth.middleware";
import { authApiController } from "./auth.api.controller";
import { habitApiController } from "./habits.api.controller";
import { notificationApiController } from "./notification.api.controller";

export const apiController = new Elysia({ prefix: "/api" })
  .use(sessionUserMiddleware)
  .guard(
    {
      async beforeHandle({ user, set }) {
        if (!user) {
          set.status = "Unauthorized";
          return (set.redirect = "/login");
        }
      },
    },
    (app) => app.use(habitApiController)
  )
  .use(notificationApiController)
  .use(authApiController);
