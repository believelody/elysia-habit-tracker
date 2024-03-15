import { Elysia, t } from "elysia";
import { context } from "../../context";
import {
  NotificationItem,
} from "../../components/notifications.component";

export const notificationApiController = new Elysia({
  prefix: "/notifications",
})
  .use(context)
  .post(
    "/",
    ({ body, html }) => {
      return html(<NotificationItem {...body} />);
    },
    {
      body: t.Object({
        type: t.Union([
          t.Literal("success"),
          t.Literal("error"),
          t.Literal("info"),
          t.Literal("warning"),
        ]),
        message: t.String(),
      }),
    }
  );
