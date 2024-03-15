import { Elysia } from "elysia";
import { habitApiController } from "./habits.api.controller";

export const apiController = new Elysia({ prefix: "/api" }).use(habitApiController)