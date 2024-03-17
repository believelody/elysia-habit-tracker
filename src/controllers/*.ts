import { Elysia } from "elysia";
import { apiController } from "./api/*";
import { homeController } from "./home.controller";
import { loginController } from "./login.controller";

export const routes = new Elysia()
  .use(homeController)
  .use(loginController)
  .use(apiController);
