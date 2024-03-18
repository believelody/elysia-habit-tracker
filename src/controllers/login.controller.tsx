import { Elysia } from "elysia";
import { context } from "../context";
import { LoginPage } from "../pages/login.page";

export const loginController = new Elysia({ prefix: "/login" })
  .use(context)
  .get("/", ({ html }) => {
    return html(<LoginPage />);
  });
