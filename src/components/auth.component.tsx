import { PrimaryButton } from "./buttons.component";
import { FormField } from "./fields.component";

export function LoginForm() {
  const errorLoginId = "error-login";
  return (
    <form hx-post="/api/auth/login" hx-target-500={`#${errorLoginId}`} hx-target-4xx={`#${errorLoginId}`}>
      <p class="text-red-500 text-center text-lg" id={errorLoginId} />
      <FormField fieldName="email" type="email" />
      <FormField fieldName="password" type="password" />
      <PrimaryButton text="Log In" />
    </form>
  );
}

export function RegisterForm() {
  return (
    <form hx-post="/api/auth/register">
      <FormField fieldName="name" />
      <FormField fieldName="email" type="email" />
      <FormField fieldName="password" type="password" />
      <PrimaryButton text="Submit" />
    </form>
  );
}