import { Elysia } from "elysia";
import { type Habit } from "../components/habits.component";
import { authMiddleware } from "../middlewares/auth.middleware";
import { HomePage } from "../pages/index.page";
import { habitService } from "../services/habits.service";
import { context } from "../context";

export const homeController = new Elysia({ prefix: "/", scoped: true })
  .use(authMiddleware)
  .get("/", async ({ html, user }) => {
    const habits = habitService.findAll() as Habit[];
    return html(<HomePage habits={habits} />);
  });
