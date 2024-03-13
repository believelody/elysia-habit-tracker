import { migrate, getMigrations } from "bun-sqlite-migrations";
import Database from "bun:sqlite";
import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from 'lucia';

export const db = new Database("db.sqlite");

export const adapter = new BunSQLiteAdapter(db, {
  user: "users",
  session: "sessions",
});

migrate(db, getMigrations("./migrations"));

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}