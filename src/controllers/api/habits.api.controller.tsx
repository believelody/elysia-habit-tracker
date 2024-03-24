import { Elysia, t } from "elysia";
import {
  HabitHistoryItem,
  HabitItem,
  Habits
} from "../../components/habits.component";
import { EditHabitModal } from "../../components/modals.component";
import {
  NotificationItem,
  type Notification,
} from "../../components/notifications.component";
import { sessionUserMiddleware } from "../../middlewares/auth.middleware";
import {
  habitService
} from "../../services/habits.service";

export const habitApiController = new Elysia({
  prefix: "/habits",
})
  .use(sessionUserMiddleware)
  .get("/", async ({ html, user }) => {
    const habits = await habitService.findManyByUserId(user.id);
    return html(<Habits habits={habits} />);
  })
  .post(
    "/",
    async ({ body, set, html, user }) => {
      const habitsCount = await habitService.count(user.id);
      const createdHabit = await habitService.create({ ...body, userId: user.id });
      if (body.color === "#000000") {
        set.status = "Internal Server Error";
        return "Please select another color than black";
      }
      if (!createdHabit) {
        set.status = "Internal Server Error";
        return "An error occured";
      }
      set.status = "Created";
      if (habitsCount && habitsCount.length === 0) {
        set.headers["HX-Reswap"] = "outerHTML";
        return <Habits habits={[createdHabit]} />;
      }
      return html(
        <HabitItem
          item={createdHabit}
          triggerNotification={{
            type: "success",
            message: "Habit created successfully",
          }}
        />
      );
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        color: t.String(),
      }),
    }
  )
  .post("/samples", async ({ user, html }) => {
    const habits = await habitService.history.seed(user.id);
    return html(<Habits habits={habits} />);
  })
  .group(
    "/:id",
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
    (app) =>
      app
        .get(
          "/edit",
          (ctx) => {
            return ctx.html(
              <EditHabitModal habit={{ ...ctx.query, id: ctx.params.id, userId: ctx.user.id }} />
            );
          },
          {
            query: t.Object({
              title: t.String(),
              description: t.String(),
              color: t.String(),
            }),
          }
        )
        .post(
          "/toggle/:date",
          async (ctx) => {
            const { date, id } = ctx.params;
            const existingHabit = await habitService.findById(id);
            if (!existingHabit) {
              ctx.set.status = "Internal Server Error";
              return;
            }
            let habitHistory = await habitService.history.findOne(
              existingHabit.id,
              date
            );
            if (habitHistory) {
              await habitService.history.delete(existingHabit.id, habitHistory.date);
            } else {
              await habitService.history.create(existingHabit.id, date);
            }
            return ctx.html(
              <HabitHistoryItem
                habit={existingHabit}
                date={date}
                completed={!habitHistory}
              />
            );
          },
          {
            params: t.Object({
              id: t.Numeric(),
              date: t.String(),
            }),
          }
        )
        .put(
          "/",
          async ({ body, set, html, params }) => {
            const { id } = params;
            const updatedHabit = await habitService.updateById(id, body);
            if (!updatedHabit) {
              set.status = "Internal Server Error";
              return "An error occured";
            }
            set.status = "OK";

            return html(
              <HabitItem
                item={updatedHabit}
                triggerNotification={{
                  type: "success",
                  message: "Habit updated successfully",
                }}
              />
            );
          },
          {
            body: t.Object({
              title: t.String(),
              description: t.String(),
            }),
          }
        )
        .delete("/", async (ctx) => {
          const { id } = ctx.params;
          await habitService.deleteById(id);
          ctx.set.status = "No Content";
          const habitsCount = await habitService.count(ctx.user.id);
          const notification: Notification = {
            type: "success",
            message: "Habit deleted successfully",
          };
          if (habitsCount && habitsCount.length === 0) {
            ctx.set.headers["HX-Trigger"] = "load-habits";
          }
          return ctx.html(<NotificationItem {...notification} />);
        })
  )
  .onError(({ code, set, error }) => {
    console.log({ code, error });
    set.status = "Internal Server Error";
    return "An error occured";
  });
