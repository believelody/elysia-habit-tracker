export type User = {
  id: string;
  name: string;
  google_id: string;
};

export type CreateUserDB = {
    $id: User["id"];
    $name: User["name"];
    $google_id: User["google_id"];
};

export type CreateUserData = {
    id: User["id"];
    name: User["name"];
    google_id: User["google_id"];
};

export type UpdateUserDB = {
  $id: User["id"];
  $name: User["name"];
};

export type UpdateUserData = {
    name: User["name"];
};

