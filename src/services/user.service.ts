import { NotFoundError, InternalServerError } from "elysia";
import { db } from "../db";
import type {
  User,
  UpdateUserData,
  UpdateUserDB,
  CreateUserData,
  CreateUserDB,
} from "../models/user.model";

export const userService = {
  getAll(): User[] {
    return db.query<User, null>("SELECT * FROM users").all(null);
  },

  getById(userId: string): User | null | never {
    const result: User | null = db
      .query<User, string>("SELECT * FROM users WHERE id = ?")
      .get(userId);

    return result;
  },

  getByGoogleId(googleId: string): User | null | never {
    const result: User | null = db
      .query<User, string>("SELECT * FROM users WHERE google_id = ? LIMIT 1")
      .get(googleId);

    return result;
  },

  getByEmail(email: string): User | null | never {
    const result: User | null = db
      .query<User, string>("SELECT * FROM users WHERE email = ? LIMIT 1")
      .get(email);

    return result;
  },

  deleteById(userId: string): void | never {
    const result: User | null = db
      .query<User, string>("DELETE FROM users WHERE id = ? RETURNING *")
      .get(userId);
    console.log("In delete by id: ", result);
    if (!result) {
      throw new InternalServerError("User was not deleted.");
    }

    return;
  },

  updateById(userId: string, updateData: UpdateUserData): User | never {
    const user = this.getById(userId);
    if (!user) {
      throw new NotFoundError(`User does not exist`);
    }
    const updateObj: UpdateUserDB = {
      $name: updateData.name ?? user.name,
      $id: user.id,
    };

    const result: User | null = db
      .query<User, Record<string, string>>(
        `UPDATE users 
          SET name = $name
          WHERE id = $id`
      )
      .get(updateObj);

    if (!result) {
      throw new InternalServerError("User was not updated.");
    }

    return result;
  },

  create(createData: CreateUserData): User | never {
    const createObj: CreateUserDB = {
      $name: createData.name,
      $id: createData.id,
      $google_id: createData.google_id,
      $email: createData.email,
      $password: createData.password,
      $authType: createData.authType,
    };

    const result: User | null = db
      .query<User, Record<string, string>>(
        `INSERT INTO users
          (id, name, google_id)
          VALUES ($id, $name, $google_id, $email, $password)
          RETURNING *`
      )
      .get(createObj as unknown as Record<string, string>);

    if (!result) {
      throw new InternalServerError("User was not created.");
    }

    return result;
  },
};
