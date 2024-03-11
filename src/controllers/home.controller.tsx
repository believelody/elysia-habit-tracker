import { html } from "@elysiajs/html";
import { Elysia } from "elysia";
import { type Habit } from "../components/habits.component";
import { HomePage } from "../pages/Home";
import { habitService } from "../services/habits.service";

export const homeController = new Elysia({ prefix: "/" })
  .use(html())
  .get("/", async (ctx) => {
    const habits = habitService.findAll() as Habit[];
    return ctx.html(<HomePage habits={habits} />);
  });
