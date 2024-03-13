import { Elysia } from "elysia";

export const authApiController = new Elysia({ prefix: "/auth" }).group(
  "/login",
  (app) =>
    app.post("/google", ({}) => {
      return;
    })
);
