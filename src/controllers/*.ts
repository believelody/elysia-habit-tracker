import { Elysia } from "elysia";
import { homeController } from "./home.controller";
import { apiController } from "./api/*";

export const routes = new Elysia().use(homeController).use(apiController);
