export type TAuthType = "basic" | "google";

export type User<TAuthType> = TAuthType extends "basic"
  ? {
      id: string;
      name: string;
      email: string;
      password: string;
    }
  : {
      id: string;
      name: string;
      google_id: string;
    };

export type BasicUser = User<"basic">;

export type GoogleUser = User<"google">;

export type CreateBasicUserDB = {
  $id: BasicUser["id"];
  $name: BasicUser["name"];
  $email?: BasicUser["email"];
  $password?: BasicUser["password"];
};

export type CreateGoogleUserDB = {
  $id: GoogleUser["id"];
  $name: GoogleUser["name"];
  $google_id: GoogleUser["google_id"];
};

export type CreateUserDB<TAuthType = "basic" | "google"> =
  TAuthType extends "basic" ? CreateBasicUserDB : CreateGoogleUserDB;

export type CreateBasicUserData = {
  name: BasicUser["name"];
  email: BasicUser["email"];
  password: BasicUser["password"];
};

export type CreateGoogleUserData = {
  name: GoogleUser["name"];
  google_id: GoogleUser["google_id"];
};

export type CreateUserData<TAuthType = "basic" | "google"> =
  TAuthType extends "basic" ? CreateBasicUserData : CreateGoogleUserData;

export type UpdateUserDB<TAuthType> = {
  $id: User<TAuthType>["id"];
  $name: User<TAuthType>["name"];
};

export type UpdateUserData<TAuthType> = {
  name: User<TAuthType>["name"];
};
