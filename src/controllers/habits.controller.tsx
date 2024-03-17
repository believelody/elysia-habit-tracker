import { Elysia } from "elysia";
import { authMiddleware } from "../middlewares/auth.middleware";
import { HabitsPage } from "../pages/habits.page";
import { habitService } from "../services/habits.service";

export const habitsController = new Elysia({ prefix: "/habits", scoped: true })
  .use(authMiddleware)
  .get("/", async ({ html, user }) => {
    const habits = habitService.findAll();
    return html(<HabitsPage habits={habits} />);
  });
