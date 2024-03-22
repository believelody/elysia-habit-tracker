export type User = {
  id: string;
  name: string;
  google_id?: string;
  email?: string;
  password?: string;
  authType: "basic" | "google";
};

export type CreateUserDB = {
    $id: User["id"];
    $name: User["name"];
    $google_id?: User["google_id"];
    $email?: User["email"];
    $password?: User["password"];
    $authType: User["authType"];
};

export type CreateUserData = {
    id: User["id"];
    name: User["name"];
    google_id?: User["google_id"];
    email?: User["email"];
    password?: User["password"];
    authType: User["authType"];
};

export type UpdateUserDB = {
  $id: User["id"];
  $name: User["name"];
};

export type UpdateUserData = {
    name: User["name"];
    email: User["email"];
};

