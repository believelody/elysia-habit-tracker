import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import { routes } from "./controllers/*";
import { config } from "./config";

export const app = new Elysia().use(staticPlugin()).use(routes).listen(config.port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
