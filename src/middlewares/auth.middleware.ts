import { Elysia } from "elysia";
import { context } from "../context";

export const authMiddleware = new Elysia({ name: "Middleware.AuthAndRedirect" })
  .use(context)
  .derive(async ({ cookie: { lucia_session }, lucia, path }) => {
    console.log("In auth middleware derive : ", path, {
      lucia_session: lucia_session.value,
    });
    if (lucia_session.value) {
      const { user } = await lucia.validateSession(lucia_session.value);
      if (user) {
        return { user };
      }
    }
  })
  .onBeforeHandle(({ set, path, user }) => {
    console.log("In auth middleware on before: ", path);
    if (!user) {
      return (set.redirect = "/login");
    }
  });

export const checkAuthMiddleware = new Elysia({ name: "Middleware.CheckAuth" })
  .use(context)
  .derive(async ({ cookie: { lucia_session }, set, lucia, path }) => {
    console.log("In check auth middleware derive: ", path);
    if (!lucia_session?.value) {
      set.status = "Unauthorized";
      return;
    }
    const { user } = await lucia.validateSession(lucia_session.value);
    return { isAuth: !!user };
  });
