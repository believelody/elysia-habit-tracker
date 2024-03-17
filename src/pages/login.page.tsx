import { RootLayout } from "../components/layouts.component";
import { LoginForm } from "../components/login.component";

export function LoginPage() {
  return (
    <RootLayout
      title="Please login or create an account"
      class="flex flex-col items-center justify-center p-2"
    >
      <div class={"mx-auto w-full md:w-2/3 xl:w-1/2 gap-y-4 flex flex-col rounded border p-4"}>
        <h2 class={"text-2xl text-center"}>Please Log in</h2>
        <LoginForm />
        <section class={"flex items-center gap-x-2"}>
          <span class={"grow bg-white h-0.5"}></span>
          <span>Or</span>
          <span class={"grow bg-white h-0.5"}></span>
        </section>
      </div>
    </RootLayout>
  );
}
