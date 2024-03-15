import classNames from "classnames";
import { generateDatesByNumberOfDays, generateDatesWithCompletion } from "../lib";

type HabitFormFieldProps = {
  fieldName: string;
  type?: string;
  value?: string;
  class?: string;
};

export type Habit = {
  id: number;
  title: string;
  description: string;
  color: string;
  histories?: HabitHistory[];
};

export type HabitsProps = { habits: Habit[] };

export type HabitHistory = {
  date: string;
  habitId: number;
};

function HabitFormField({
  fieldName,
  type,
  value,
  class: className,
}: HabitFormFieldProps) {
  const classes = [
    "flex gap-x-3 items-center justify-center p-2",
    className,
  ].join(" ");
  return (
    <div class={classes}>
      <label class={"capitalize"} for={fieldName}>
        {fieldName}
      </label>
      <input
        class={"grow rounded-md bg-neutral-800"}
        name={fieldName}
        id={fieldName}
        type={type || "text"}
        value={value || ""}
        required
      />
    </div>
  );
}

export function CreateHabitForm() {
  const targetId = "habit-list";
  const createHabitErrorMessageId = "create-habit-error";
  const createHabitFormRef = "create-habit-form";
  return (
    <form
      hx-post="/api/habits"
      hx-swap={`afterbegin`}
      hx-target={`#${targetId}`}
      hx-target-5xx={`#${createHabitErrorMessageId}`}
      x-ref={createHabitFormRef}
      x-init={`
        $el.addEventListener('htmx:afterRequest', (event) => {
          console.log(event.detail);
          if(event.detail.xhr.status === 200){
            $el.reset();
            showForm = false;
          }
        });
      `}
      class={"flex flex-col gap-y-4 border p-8 rounded-xl max-w-3xl mx-auto"}
    >
      <div class={"flex items-center gap-x-8 w-full"}>
        <HabitFormField class="w-2/3" fieldName="title" />
        <HabitFormField class="w-1/3" fieldName="color" type="color" />
      </div>
      <HabitFormField fieldName="description" />
      <p
        id={createHabitErrorMessageId}
        class={"text-center text-red-500 p-2"}
      />
      <div class={"flex items-center justify-center gap-x-3"}>
        <button
          class="hover:text-red-700"
          x-on:click={`
            $refs["${createHabitFormRef}"].reset();
            document.getElementById("${createHabitErrorMessageId}").textContent = "";
            showForm = false;
          `}
          type="button"
        >
          Cancel
        </button>
        <span>.</span>
        <button class="hover:text-sky-700" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

export function EditHabitForm({
  title,
  description,
  color,
  id,
  modalRef,
}: Habit & { modalRef: string }) {
  const editHabitErrorMessageId = "edit-habit-error";
  const targetItem = "habit-item-" + id;
  return (
    <form
      hx-put={"/api/habits/" + id}
      hx-target={`#${targetItem}`}
      hx-target-4xx={`#${editHabitErrorMessageId}`}
      hx-target-5xx={`#${editHabitErrorMessageId}`}
      x-init={`
        $el.addEventListener('htmx:afterRequest', (event) => {
          if(event.detail.xhr.status === 200){
            $refs["${modalRef}"].remove();
          }
        });
      `}
      class={"flex flex-col gap-y-4 border p-8 rounded-xl w-full mx-auto"}
    >
      <HabitFormField fieldName="title" value={title} />
      <HabitFormField fieldName="description" value={description} />
      <p class="text-red-500 p-2 text-center" id={editHabitErrorMessageId} />
      <div class={"flex items-center justify-center gap-x-3"}>
        <button
          class="hover:text-red-700"
          x-on:click={`$refs["${modalRef}"].remove();`}
          type="button"
        >
          Cancel
        </button>
        <span class={"p-0.5 bg-white rounded-full"} />
        <button class="hover:text-sky-700" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

export function CreateHabitButton() {
  return (
    <button
      class={
        "p-4 text-center border rounded-xl hover:bg-slate-300 hover:text-slate-700 w-full md:w-3/4 mx-auto text-3xl flex gap-x-4 items-center justify-center"
      }
      x-on:click="showForm = true"
    >
      <span>Add Habit</span>
      <span
        class={
          "p-2 h-12 w-12 flex items-center justify-center rounded-full border"
        }
      >
        +
      </span>
    </button>
  );
}

export function CreateHabitComponent() {
  return (
    <div x-data="{ showForm: false }">
      <div x-show="showForm">
        <CreateHabitForm />
      </div>
      <div x-show="!showForm">
        <CreateHabitButton />
      </div>
    </div>
  );
}

export function HabitComponent({ item }: { item: Habit }) {
  const habitHistories = "habit-histories-" + item.id;
  return (
    <section
      class={
        "rounded-md border border-slate-300 p-5 flex flex-col gap-y-4 max-w-xl"
      }
      hx-get={`/api/habits/${item.id}/histories`}
      hx-trigger="load"
      hx-target={`#${habitHistories}`}
      hx-swap="outerHTML"
    >
      <h2 class={"text-xl font-medium"}>{item.title}</h2>
      <p class={"text-md text-slate-400"}>{item.description}</p>
      <div id={habitHistories} />
      <div class={"flex gap-x-4"}>
        <button
          class={
            "px-3 py-2 rounded border text-sky-600 hover:bg-sky-600 hover:text-white"
          }
          hx-get={`/api/habits/${item.id}/edit`}
          hx-target="body"
          hx-swap="afterbegin"
          hx-vals={JSON.stringify({
            title: item.title,
            description: item.description,
            color: item.color,
          })}
        >
          Edit
        </button>
        <button
          class={
            "px-3 py-2 rounded border text-red-600 hover:bg-red-600 hover:text-white"
          }
          hx-delete={`/api/habits/${item.id}`}
          hx-swap="delete"
          hx-target="closest li"
          hx-confirm="Are you sure ?"
        >
          Delete
        </button>
      </div>
    </section>
  );
}

// export function HabitItem({ item }: { item: Habit }) {
//   return (
//     <li x-data="{ showForm: false }">
//       <div x-show="showForm">
//         <EditHabitForm {...item} />
//       </div>
//       <div x-show="!showForm">
//         <HabitComponent item={item} />
//       </div>
//     </li>
//   );
// }

export function HabitItem({ item }: { item: Habit }) {
  return (
    <li id={`habit-item-${item.id}`}>
      <HabitComponent item={item} />
    </li>
  );
}

export function Habits({ habits }: HabitsProps) {
  return (
    <ul
      id={"habit-list"}
      class={"grid grid-cols-1 md:grid-cols-2 gap-5 p-4 mx-auto border"}
    >
      {habits.map((habit) => (
        <HabitItem item={habit} />
      ))}
    </ul>
  );
}

export function HabitHistoryItem({
  habit,
  date,
  completed
}: {
  habit: Habit;
  date: string;
  completed: boolean;
}) {
  return (
    <li
      class={`w-5 h-5 rounded cursor-pointer ${
        completed ? `bg-[${habit.color}]` : "bg-black"
      }`}
      title={date}
      hx-post={`/api/habits/${habit.id}/toggle/${date}`}
      hx-target="this"
      hx-swap="outerHTML"
    />
  );
}

export function HabitHistoryList({ habit, histories }: { habit: Habit; histories: HabitHistory[] }) {
  const dates = generateDatesByNumberOfDays(90);
  return (
    <ul class={"flex gap-1 flex-wrap"}>
      {dates.map((date) => {
        const formatedDate = date.toISOString().slice(0, 10);
        return (
          <HabitHistoryItem
            habit={habit}
            date={formatedDate}
            completed={histories.some(
              (history) => history.date === formatedDate
            )}
          />
        );
      })}
    </ul>
  );
}
