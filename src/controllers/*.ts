import { Elysia } from "elysia";
import { apiController } from "./api/*";
import { habitsController } from "./habits.controller";
import { loginController } from "./login.controller";
import { homeController } from "./home.controller";

export const routes = new Elysia()
  .use(homeController)
  .use(loginController)
  .use(apiController)
  .use(habitsController);
