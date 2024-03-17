import { Elysia } from "elysia";
import { type Habit } from "../components/habits.component";
import { authMiddleware } from "../middlewares/auth";
import { HomePage } from "../pages/index.page";
import { habitService } from "../services/habits.service";

export const homeController = new Elysia({ prefix: "/" })
  .use(authMiddleware)
  .get("/", async ({ html }) => {
    const habits = habitService.findAll() as Habit[];
    return html(<HomePage habits={habits} />);
  });
