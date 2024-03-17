import { Elysia } from "elysia";
import { context } from "../context";

export const authMiddleware = new Elysia({ name: "Middleware.AuthAndRedirect" })
  .use(context)
  .derive(async ({ cookie: { lucia_session }, set, lucia, path }) => {
    if (!lucia_session?.value) {
      set.status = "Unauthorized";
      return (set.redirect = "/login");
    }
    const { user } = await lucia.validateSession(lucia_session.value);
    if (!user) {
      set.status = "Not Found";
      return (set.redirect = "/login");
    }
    return { user };
  }).onBeforeHandle(({ set }) => {
    if (set.status !== 200 || set.status) {
      return set.redirect;
    }
  });

export const checkAuthMiddleware = new Elysia({ name: "Middleware.CheckAuth" })
  .use(context)
  .derive(async ({ cookie: { lucia_session }, set, lucia, path }) => {
    if (!lucia_session?.value) {
      set.status = "Unauthorized";
      return;
    }
    const { user } = await lucia.validateSession(lucia_session.value);
    return { isAuth: !!user };
  });