export type Habit = {
  id: number;
  title: string;
  description: string;
  color: string;
  histories?: HabitHistory[];
  userId: string;
};

export type CreateHabitDB = {
  $title: Habit["title"];
  $description: Habit["description"];
  $color: Habit["color"];
  $userId: Habit["userId"];
};

export type CreateHabitData = Pick<
  Habit,
  "title" | "description" | "color" | "userId"
>;

export type UpdateHabitDB = {
  $id: Habit["id"];
  $title: Habit["title"];
  $description: Habit["description"];
  $color: Habit["color"];
};

export type UpdateHabitData = Pick<Habit, "title" | "description">;

export type HabitHistory = {
  date: string;
  habitId: number;
};

export type HabitHistoryDB = {
  $date: HabitHistory["date"];
  $habitId: HabitHistory["habitId"];
};

export type HabitHistoryData = {
  date: HabitHistory["date"];
  habitId: HabitHistory["habitId"];
};
