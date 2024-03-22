import { generateCodeVerifier, generateState } from "arctic";
import { Elysia, t } from "elysia";
import { Argon2id } from "oslo/password";
import { GoogleProfile } from "../../auth";
import { context } from "../../context";
import { fetchApi } from "../../lib";
import { userService } from "../../services/user.service";

const googleAuthApiController = new Elysia({ prefix: "/google" })
  .use(context)
  .get(
    "/",
    async ({ auth, set, cookie: { google_code_verifier, google_state } }) => {
      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const url = await auth.google.createAuthorizationURL(
        state,
        codeVerifier,
        {
          scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
        }
      );
      google_code_verifier.set({
        value: codeVerifier,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        path: "/",
      });
      google_state.set({
        value: state,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        path: "/",
      });
      return (set.redirect = url.toString());
    }
  )
  .get(
    "/callback",
    async ({
      set,
      query,
      cookie: { google_code_verifier, google_state, lucia_session },
      auth,
      lucia,
    }) => {
      const { state, code } = query;
      const stateCookie = google_state.value;
      const codeVerifier = google_code_verifier.value;
      if (!state || !stateCookie || stateCookie !== state || !codeVerifier) {
        return (set.status = "Bad Request");
      }

      const tokens = await auth.google.validateAuthorizationCode(
        code,
        codeVerifier
      );
      const googleUserResult = await fetchApi<GoogleProfile>(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );
      function getUserOrCreate() {
        const existingUser = userService.getByGoogleId(googleUserResult.id);

        return (
          existingUser ??
          userService.create<"google">({
            google_id: googleUserResult.id,
            name: googleUserResult.name,
            // id: generateId(15),
          })
        );
      }
      const user = getUserOrCreate();

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      lucia_session.value = sessionCookie.value;
      lucia_session.set(sessionCookie.attributes);
      return (set.redirect = "/habits");
    },
    {
      query: t.Object({
        state: t.String(),
        code: t.String(),
      }),
    }
  );

export const authApiController = new Elysia({ prefix: "/auth" })
  .use(context)
  .group("/login", (app) =>
    app
      .post(
        "/",
        async ({ body, set, cookie: { lucia_session }, lucia }) => {
          const { email, password } = body;
          const user = userService.getByEmail(email);
          if (!user) {
            set.status = "Bad Request";
            return "Invalid email or password";
          }
          // Ensure that user is BasicUser
          // if (!user.password) {
          //   set.status = "Internal Server Error";
          //   return;
          // }
          const validPassword = await new Argon2id().verify(
            user.password,
            password
          );
          if (!validPassword) {
            set.status = "Bad Request";
            return "Invalid password or password";
          }
          const session = await lucia.createSession(user.id, {});
          const sessionCookie = lucia.createSessionCookie(session.id);
          lucia_session.value = sessionCookie.value;
          lucia_session.set(sessionCookie.attributes);
          return (set.headers["HX-Redirect"] = "/");
        },
        {
          body: t.Object({
            email: t.String({ format: "email" }),
            password: t.String(),
          }),
        }
      )
      .use(googleAuthApiController)
  )
  .post(
    "/register",
    async ({
      set,
      cookie: { lucia_session },
      body: { email, password, name },
      lucia,
    }) => {
      const existingUser = userService.getByEmail(email);
      if (existingUser) {
        set.status = "Conflict";
        return "User already exist";
      }
      const hashedPassword = await Bun.password.hash(password);
      const newUser = userService.create<"basic">({
        name,
        email,
        password: hashedPassword,
      });
      const session = await lucia.createSession(newUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      lucia_session.value = sessionCookie.value;
      lucia_session.set(sessionCookie.attributes);
      return (set.headers["HX-Redirect"] = "/habits");
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )
  .post("/logout", async ({ cookie: { lucia_session }, lucia, set }) => {
    if (!lucia_session?.value) {
      set.status = "Unauthorized";
      return;
    }
    await lucia.invalidateSession(lucia_session?.value);
    const sessionCookie = lucia.createBlankSessionCookie();
    lucia_session.value = sessionCookie.value;
    lucia_session.set(sessionCookie.attributes);
    return (set.headers["HX-Redirect"] = "/");
  });
