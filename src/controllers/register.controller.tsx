import { Elysia } from "elysia";
import { context } from "../context";
import { RegisterPage } from "../pages/register.page";

export const registerController = new Elysia({ prefix: "/register" })
  .use(context)
  .get("/", ({ html }) => {
    return html(<RegisterPage />);
  });
