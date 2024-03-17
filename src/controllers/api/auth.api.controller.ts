import { generateCodeVerifier, generateState } from "arctic";
import { Elysia, t } from "elysia";
import { context } from "../../context";
import { GoogleUser } from "../../auth";
import { fetchApi } from "../../lib";
import { userService } from "../../services/user.service";
import { generateId } from "lucia";

export const authApiController = new Elysia({ prefix: "/auth" })
  .use(context)
  .group(
    "/login",
    (app) =>
      app
        .get(
          "/google",
          async ({
            auth,
            set,
            cookie: { google_code_verifier, google_state },
          }) => {
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
          "/google/callback",
          async ({
            db,
            set,
            query,
            cookie: { google_code_verifier, google_state, lucia_session },
            auth,
            lucia,
          }) => {
            const { state, code } = query;
            const stateCookie = google_state.value;
            const codeVerifier = google_code_verifier.value;
            if (
              !state ||
              !stateCookie ||
              stateCookie !== state ||
              !codeVerifier
            ) {
              return (set.status = "Bad Request");
            }

            const tokens = await auth.google.validateAuthorizationCode(
              code,
              codeVerifier
            );
            const googleUserResult = await fetchApi<GoogleUser>(
              "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              }
            );
            function getOrCreateUser() {
              const existingUser = userService.getByGoogleId(
                googleUserResult.id
              );

              return (
                existingUser ??
                userService.create({
                  google_id: googleUserResult.id,
                  name: googleUserResult.name,
                  id: generateId(15),
                })
              );
            }
            const user = getOrCreateUser();

            const session = await lucia.createSession(user.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            lucia_session.value = sessionCookie.value;
            lucia_session.set(sessionCookie.attributes);
            return (set.redirect = "/");
          },
          {
            query: t.Object({
              state: t.String(),
              code: t.String(),
            }),
          }
        )
  );
