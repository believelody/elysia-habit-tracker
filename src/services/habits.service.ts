import { type HabitHistory, type Habit } from "../components/habits.component";
import { db } from "../db";
import { generateDatesWithCompletion } from "../lib";

export type CreateHabit = Omit<Habit, "id">;
export type UpdateHabit = Partial<CreateHabit>;

export const habitService = {
  findAll() {
    return db.query("select * from habits order by id desc").all() as Habit[];
  },
  findById(id: number) {
    return db
      .query("select * from habits where id=$id")
      .get({ $id: id }) as Habit | null;
  },
  create({ title, description, color }: CreateHabit) {
    return db
      .query(
        "insert into habits (title, description, color) values ($title, $description, $color) returning *"
      )
      .get({
        $title: title,
        $description: description,
        $color: color,
      }) as Habit | null;
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
      .query(`update habits set ${columnsToUpdate} where id=$id returning *`)
      .get({ $id: id, ...tableColumns }) as Habit | null;
  },
  deleteById(id: number) {
    return db.query("delete from habits where id=$id").run({ $id: id });
  },
};

export const habitHistoryService = {
  seedHabits() {
    const habits = habitService.findAll();
    habits.forEach((habit) => {
      const histories = generateDatesWithCompletion(90);
      histories.forEach((history) => {
        if (history.completed) {
          this.create(habit.id, history.date);
        }
      })
    })
  },
  findOne(id: number, date: string) {
    return db
      .query(
        "select * from habits_history where habit_id=$id and date=$date"
      )
      .get({ $id: id, $date: date }) as HabitHistory | null;
  },
  findByHabitId(habitId: number) {
    return db.query("select * from habits_history where habit_id=$habitId").all({ $habitId: habitId }) as HabitHistory[];
  },
  create(id: number, date: string) {
    return db
      .query(
        "insert into habits_history (habit_id, date) values ($id, $date) returning *"
      )
      .get({ $id: id, $date: date }) as HabitHistory | null;
  },
  delete(id: number, date: string) {
    return db
      .query("delete from habits_history where habit_id=$id and date=$date")
      .run({ $id: id, $date: date });
  },
};
