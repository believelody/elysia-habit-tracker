import { Elysia, t } from "elysia";
import {
  HabitHistoryItem,
  HabitHistoryList,
  HabitItem,
} from "../../components/habits.component";
import { EditHabitModal } from "../../components/modals.component";
import { context } from "../../context";
import {
  habitHistoryService,
  habitService,
} from "../../services/habits.service";

export const habitApiController = new Elysia({ prefix: "/habits" })
  .use(context)
  .post(
    "/",
    async ({ body, set, html }) => {
      const createdHabit = habitService.create(body);
      if (body.color === "#000000") {
        set.status = "Internal Server Error";
        return "Please select another color than black";
      }
      if (!createdHabit) {
        set.status = "Internal Server Error";
        return "An error occured";
      }
      set.status = "Created";

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
              <EditHabitModal habit={{ ...ctx.query, id: ctx.params.id }} />
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
        .get("/histories", (ctx) => {
          const { id } = ctx.params;
          const existingHabit = habitService.findById(id);
          if (!existingHabit) {
            ctx.set.status = "Internal Server Error";
            return;
          }
          const histories = habitHistoryService.findByHabitId(id);
          return ctx.html(
            <HabitHistoryList habit={existingHabit} histories={histories} />
          );
        })
        .post(
          "/toggle/:date",
          (ctx) => {
            const { date, id } = ctx.params;
            const existingHabit = habitService.findById(id);
            if (!existingHabit) {
              ctx.set.status = "Internal Server Error";
              return;
            }
            let habitHistory = habitHistoryService.findOne(
              existingHabit.id,
              date
            );
            if (habitHistory) {
              habitHistoryService.delete(existingHabit.id, habitHistory.date);
            } else {
              habitHistoryService.create(existingHabit.id, date);
            }
            return ctx.html(
              <HabitHistoryItem
                habit={existingHabit}
                date={date}
                completed={habitHistory === null}
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
            const updatedHabit = habitService.updateById(id, body);
            if (!updatedHabit) {
              set.status = "Internal Server Error";
              return "An error occured";
            }
            set.status = "OK";

            return html(<HabitItem item={updatedHabit} triggerNotification={{ type: "success", message: "Habit updated successfully" }} />);
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
          habitService.deleteById(id);
          ctx.set.status = "No Content";
          return;
        })
  )
  .onError(({ code, set, error }) => {
    console.log({ code, error });
    set.status = "Internal Server Error";
    return "An error occured";
  });
