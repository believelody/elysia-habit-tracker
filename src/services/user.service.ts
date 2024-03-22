import { InternalServerError, NotFoundError } from "elysia";
import { db } from "../db";
import type {
  BasicUser,
  CreateUserDB,
  CreateUserData,
  GoogleUser,
  UpdateUserDB,
  UpdateUserData,
  User
} from "../models/user.model";
import { generateId } from "lucia";

export const userService = {
  getAll<TAuhType>(): User<TAuhType>[] {
    return db.query<User<TAuhType>, null>("SELECT * FROM users").all(null);
  },

  getById<TAuhType>(userId: string): User<TAuhType> | null | never {
    const result: User<TAuhType> | null = db
      .query<User<TAuhType>, string>("SELECT * FROM users WHERE id = ?")
      .get(userId);

    return result;
  },

  getByGoogleId(googleId: string): GoogleUser | null | never {
    const result: GoogleUser | null = db
      .query<GoogleUser, string>(
        "SELECT * FROM users WHERE google_id = ? LIMIT 1"
      )
      .get(googleId);

    return result;
  },

  getByEmail(email: string): BasicUser | null | never {
    const result: BasicUser | null = db
      .query<BasicUser, string>("SELECT * FROM users WHERE email = ? LIMIT 1")
      .get(email);

    return result;
  },

  deleteById<TAuthType>(userId: string): void | never {
    const result: User<TAuthType> | null = db
      .query<User<TAuthType>, string>(
        "DELETE FROM users WHERE id = ? RETURNING *"
      )
      .get(userId);
    console.log("In delete by id: ", result);
    if (!result) {
      throw new InternalServerError("User was not deleted.");
    }

    return;
  },

  updateById<TAuthType>(
    userId: string,
    updateData: UpdateUserData<TAuthType>
  ): User<TAuthType> | never {
    const user = this.getById(userId);
    if (!user) {
      throw new NotFoundError(`User does not exist`);
    }
    const updateObj: UpdateUserDB<TAuthType> = {
      $name: updateData.name ?? user.name,
      $id: user.id,
    };

    const result: User<TAuthType> | null = db
      .query<User<TAuthType>, Record<string, string>>(
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

  create<TAuthType>(
    createData: CreateUserData<TAuthType>
  ): User<TAuthType> | never {
    const id = generateId(15);
    const createObj = Object.entries({ id, ...createData}).reduce((acc, [key, value]) => {
      acc = {
        ...acc,
        [`$${key}`]: value,
      };
      return acc;
    }, <CreateUserDB<TAuthType>>{});

    const result: User<TAuthType> | null = db
      .query<User<TAuthType>, Record<string, string>>(
        `INSERT INTO users
          (${Object.keys({ id, ...createData}).join(", ")})
          VALUES (${Object.keys(createObj).join(", ")})
          RETURNING *`
      )
      .get(createObj as unknown as Record<string, string>);

    if (!result) {
      throw new InternalServerError("User was not created.");
    }

    return result;
  },
};
