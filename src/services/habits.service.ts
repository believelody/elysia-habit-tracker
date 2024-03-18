import { type HabitHistory, type Habit } from "../components/habits.component";
import { db } from "../db";
import { generateDatesWithCompletion } from "../lib";

export type CreateHabit = Omit<Habit, "id">;
export type UpdateHabit = Partial<CreateHabit>;

export const habitService = {
  count(userId: string) {
    return db
      .query<{ "count(*)": number } | null, { $userId: string }>(
        "select count(*) from habits where user_id=$userId"
      )
      .get({ $userId: userId });
  },
  seed(userId: string) {
    return db
      .query<Habit, { $userId: string }>(querySeed)
      .all({ $userId: userId });
  },
  findById(id: number) {
    return db
      .query<Habit | null, { $id: number }>("select * from habits where id=$id")
      .get({ $id: id });
  },
  findManyByUserId(userId: string) {
    return db
      .query<Habit, { $userId: string }>(
        "select * from habits where user_id=$userId"
      )
      .all({ $userId: userId });
  },
  create({ title, description, color, userId }: CreateHabit) {
    return db
      .query<
        Habit | null,
        {
          $title: string;
          $description: string;
          $color: string;
          $userId: string;
        }
      >(
        "insert into habits (title, description, color, user_id) values ($title, $description, $color, $userId) returning *"
      )
      .get({
        $title: title,
        $description: description,
        $color: color,
        $userId: userId,
      });
  },
  updateById(id: number, body: UpdateHabit) {
    const columnsToUpdate = Object.keys(body)
      .map((key) => `${key}=$${key}`)
      .join(", ");

    const tableColumns = Object.entries(body).reduce(
      (acc, [key, value]) => ({ ...acc, [`$${key}`]: value }),
      {}
    );
    // const existingHabit = this.findById(id);

    // if (!existingHabit) {
    //   throw new Error(`habit with id = ${id} not found`);
    // }

    return db
      .query<Habit | null, typeof tableColumns & { $id: number }>(
        `update habits set ${columnsToUpdate} where id=$id returning *`
      )
      .get({ $id: id, ...tableColumns });
  },
  deleteById(id: number) {
    return db
      .query<void, { $id: number }>("delete from habits where id=$id")
      .run({ $id: id });
  },
};

export const habitHistoryService = {
  seedHistory(userId: string) {
    const habits = habitService.seed(userId);
    habits?.forEach((habit) => {
      const histories = generateDatesWithCompletion(90);
      habit.histories = this.createBulk(
        habit.id,
        histories.filter((history) => history.completed).map(({date}) => date)
      );
    });
    return habits;
  },
  findOne(id: number, date: string): HabitHistory | null {
    return db
      .query<HabitHistory, { $id: number; $date: string }>(
        "select * from habits_history where habit_id=$id and date=$date"
      )
      .get({ $id: id, $date: date });
  },
  findByHabitId(habitId: number) {
    return db
      .query<HabitHistory, { $habitId: number }>(
        "select * from habits_history where habit_id=$habitId"
      )
      .all({ $habitId: habitId });
  },
  create(id: number, date: string) {
    return db
      .query<HabitHistory | null, { $id: number; $date: string }>(
        "insert into habits_history (habit_id, date) values ($id, $date) returning *"
      )
      .get({ $id: id, $date: date });
  },
  createBulk(id: number, dates: string[]) {
    return db
      .query<HabitHistory, []>(
        `insert into habits_history (habit_id, date) values ${dates.map(
          (date) => `(${id}, "${date}")`
        )} returning *`
      )
      .all();
  },
  delete(id: number, date: string) {
    return db
      .query<void, { $id: number; $date: string }>(
        "delete from habits_history where habit_id=$id and date=$date"
      )
      .run({ $id: id, $date: date });
  },
};

const querySeed = `
    INSERT INTO habits (title, description, color, user_id)
    VALUES (
        "Meditation",
        "Practice mindfulness for 10 minutes",
        "#F7D354",
        $userId
    ),
    (
        "Exercise",
        "Go for a 30-minute walk or run",
        "#9B59B6",
        $userId
    ),
    (
        "Journaling",
        "Write down your thoughts and feelings",
        "#F0E68C",
        $userId
    ),
    (
        "Reading",
        "Read for 30 minutes before bed",
        "#66B3FF",
        $userId
    ),
    (
        "Healthy eating",
        "Eat more fruits, vegetables, and whole grains",
        "#90EE90",
        $userId
    ),
    (
        "Learning a new skill",
        "Spend 30 minutes learning something new",
        "#E0627C",
        $userId
    ),
    (
        "Gratitude practice",
        "Write down 3 things you're grateful for",
        "#FFD700",
        $userId
    ),
    (
        "Drinking water",
        "Drink 8 glasses of water per day",
        "#C0C0C0",
        $userId
    ),
    (
        "Tidying up",
        "Spend 15 minutes decluttering your space",
        "#FFA500",
        $userId
    ),
    (
        "Getting enough sleep",
        "Aim for 7-8 hours of sleep per night",
        "#3299D8",
        $userId
    ) RETURNING *;
`;
