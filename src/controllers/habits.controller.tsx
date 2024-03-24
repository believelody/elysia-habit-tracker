import { Elysia } from "elysia";
import { sessionUserMiddleware } from "../middlewares/auth.middleware";
import { HabitsPage } from "../pages/habits.page";
import { habitService } from "../services/habits.service";

export const habitsController = new Elysia({ prefix: "/habits" })
  .use(sessionUserMiddleware)
  .guard(
    {
      beforeHandle({ user, set }) {
        if (!user) {
          set.status = "Unauthorized";
          return (set.redirect = "/login");
        }
      },
    },
    (app) =>
      app.get("/", async ({ html, user }) => {
        const habits = await habitService.findManyByUserId(user.id);
        return html(<HabitsPage habits={habits} />);
      })
  );
