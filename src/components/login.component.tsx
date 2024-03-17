import { PrimaryButton } from "./buttons.component";
import { FormField } from "./fields.component";

export function LoginForm() {
  return (
    <form hx-post="/api/auth/login">
      <FormField fieldName="name" />
      <FormField fieldName="password" type="password" />
      <PrimaryButton text="Log In" />
    </form>
  );
}