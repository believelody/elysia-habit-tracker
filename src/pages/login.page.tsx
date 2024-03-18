import { RootLayout } from "../components/layouts.component";
import { LoginForm } from "../components/login.component";

export function LoginPage() {
  return (
    <RootLayout
      title="Please login or create an account"
      class="flex flex-col items-center justify-center p-2 border"
    >
      <div class={"mx-auto w-full md:w-2/3 xl:w-1/2 gap-y-4 flex flex-col rounded border p-4"}>
        <h2 class={"text-2xl text-center"}>Log in</h2>
        <LoginForm />
        <section class={"flex items-center gap-x-2"}>
          <span class={"grow bg-white h-0.5"}></span>
          <span>Or</span>
          <span class={"grow bg-white h-0.5"}></span>
        </section>
        <a href="/api/auth/login/google" class={"text-green-600 text-center hover:underline hover:underline-offset-4"}>Log in with Google</a>
      </div>
    </RootLayout>
  );
}
