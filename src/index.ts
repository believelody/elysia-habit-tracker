import staticPlugin from "@elysiajs/static";
import { Elysia } from "elysia";
import { routes } from "./controllers/*";

export const app = new Elysia().use(staticPlugin()).use(routes).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
