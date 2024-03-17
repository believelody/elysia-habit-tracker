import { Elysia } from "elysia";
import { checkAuthMiddleware } from "../middlewares/auth.middleware";
import { HomePage } from "../pages/home.page";

export const homeController = new Elysia({ prefix: "/" })
  .use(checkAuthMiddleware)
  .get("/", async ({ html, isAuth, }) => {
    return html(<HomePage isAuth={isAuth} />);
  });
