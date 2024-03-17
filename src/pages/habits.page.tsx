import {
  CreateHabitComponent,
  type Habit,
  Habits,
} from "../components/habits.component";
import { RootLayout } from "../components/layouts.component";
import { Headings, Title } from "../components/headings.component";

export function HabitsPage({ habits }: { habits: Habit[] }) {
  return (
    <RootLayout title="Habit Tracker">
      <section class="h-full flex flex-col gap-y-8">
        <Headings>
          <a href="/">
            <Title text="Simple Habit Tracker" />
          </a>
        </Headings>
        <CreateHabitComponent />
        <Habits habits={habits} />
      </section>
    </RootLayout>
  );
}
