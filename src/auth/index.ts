import { Google } from "arctic";
import { config } from "../config";
import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";
import { db } from "../db";

export type GoogleUser = {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
  link: string;
  picture: string;
  gender: string;
  locale: string;
};

const { google } = config.credentials;

const googleAuth = new Google(
  google.clientId,
  google.clientSecret,
  google.redirectURI.href
);

const adapter = new BunSQLiteAdapter(db, {
  user: "users",
  session: "sessions",
});


export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // we don't need to expose the hashed password!
      email: attributes.email,
      name: attributes.name,
    };
  },
});

export const auth = {
  google: googleAuth,
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      name: string;
    };
  }
}