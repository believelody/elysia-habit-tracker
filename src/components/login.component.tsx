import { ClassicButton } from "./buttons.component";
import { FormField } from "./fields.component";

export function LoginForm() {
  return (
    <form hx-post="/api/auth/login">
      <FormField fieldName="name" />
      <FormField fieldName="password" type="password" />
      <ClassicButton text="Log In" />
    </form>
  );
}