import { CreateHabitComponent, type Habit, Habits } from "../components/habits.component";
import { RootLayout } from "../components/layouts.component";

export function HomePage({ habits }: { habits: Habit[] }) {
  return (
    <RootLayout title="Habit Tracker">
      <section class="bg-slate-900 text-white h-full flex flex-col gap-y-8">
        <div class="mx-auto max-w-screen-xl px-4 py-10">
          <h1 class="text-center bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl mb-8">
            Simple Habit Tracker
          </h1>
        </div>
        <CreateHabitComponent />
        <Habits habits={habits} />
      </section>
    </RootLayout>
  );
}
