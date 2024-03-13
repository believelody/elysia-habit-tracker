import { html } from "@elysiajs/html";
import { Elysia } from "elysia";
import { NotificationMap } from "../components/notifications.component";

const notifications: NotificationMap = new Map([]);

export const context = new Elysia({ name: "@app/ctx" }).decorate("notifications", notifications).use(html());