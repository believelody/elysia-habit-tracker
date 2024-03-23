import { Elysia } from "elysia";
import { context } from "../context";

export const sessionUserMiddleware = new Elysia({ name: "Middleware.AuthAndRedirect" })
  .use(context)
  .derive(async ({ cookie: { lucia_session }, lucia }) => {
    if (lucia_session.value) {
      const { user } = await lucia.validateSession(lucia_session.value);
      if (user) {
        return { user };
      }
    }
  });

export const checkAuthMiddleware = new Elysia({ name: "Middleware.CheckAuth" })
  .use(context)
  .derive(async ({ cookie: { lucia_session }, lucia, path }) => {
    if (lucia_session?.value) {
      const { user } = await lucia.validateSession(lucia_session.value);
      return { isAuth: !!user };
    }
  });
