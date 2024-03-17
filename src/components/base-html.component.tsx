import { loremIpsum } from "lorem-ipsum";
import { type Notification, NotificationList } from "./notifications.component";
import classNames from "classnames";

export type HTMLProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
  class?: HTMLBodyElement["className"]
};

export function BaseHtml({ title, children, class: className }: HTMLProps) {
  const classes = classNames(
    "bg-slate-900 text-white relative min-h-screen",
    className
  );
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <script src="https://unpkg.com/htmx.org@1.9.5"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/response-targets.js"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/loading-states.js"></script>
        <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
        ></script>
      </head>
      <body class={classes} hx-ext="response-targets" x-data>
        <NotificationList />
        {children}
      </body>
    </html>
  );
}
