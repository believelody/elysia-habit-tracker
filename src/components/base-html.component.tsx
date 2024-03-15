import { loremIpsum } from "lorem-ipsum";
import { type Notification, NotificationList } from "./notifications.component";

export type HTMLProps = {
    title: string;
    children: JSX.Element | JSX.Element[];
}

export function BaseHtml({ title, children }: HTMLProps) {
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
      <body
        class={"relative min-h-screen"}
        hx-ext="response-targets"
        x-data
      >
        <NotificationList />
        {children}
      </body>
    </html>
  );
}
