import { Elysia } from "elysia";
import { type Habit } from "../components/habits.component";
import { HomePage } from "../pages/Home";
import { habitService } from "../services/habits.service";
import { context } from "../context";

export const homeController = new Elysia({ prefix: "/" }).use(context)
  .get("/", (ctx) => {
    const habits = habitService.findAll() as Habit[];
    return ctx.html(<HomePage habits={habits} />);
  });
