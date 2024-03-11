import { migrate, getMigrations } from "bun-sqlite-migrations";
import Database from "bun:sqlite";

export const db = new Database("db.sqlite");
migrate(db, getMigrations("./migrations"));





