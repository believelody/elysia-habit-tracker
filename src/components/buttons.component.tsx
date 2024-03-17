import classNames from "classnames";

export type ButtonProps = Partial<Omit<HTMLButtonElement, "className">> & {
  children?: JSX.Element | JSX.Element[];
  text?: string;
  variant?: "solid";
  class?: HTMLButtonElement["className"];
};

export function Button({ children, text, class: className }: ButtonProps) {
  const classes = classNames(
    "px-3 py-2 border border-transparent rounded",
    className
  );
  return <button class={classes}>{text ?? children}</button>;
}

export function PrimaryButton({ children, text }: ButtonProps) {
  return (
    <Button
      text={text}
      children={children}
      class={"border-white hover:bg-white hover:text-zinc-900"}
    />
  );
}

export function SecondaryButton({ children, text }: ButtonProps) {
  return (
    <Button text={text} children={children} class={"hover:border-white"} />
  );
}

export function SuccessButton({ children, text, variant }: ButtonProps) {
  return (
    <Button
      text={text}
      children={children}
      class={
        variant
          ? "text-green-600 hover:bg-green-600 hover:text-white"
          : "hover:text-green-600"
      }
      variant={variant}
    />
  );
}

export function DangerButton({ children, text, variant }: ButtonProps) {
  return (
    <Button
      text={text}
      children={children}
      class={
        variant
          ? "text-red-600 hover:bg-red-600 hover:text-white"
          : "hover:text-red-600"
      }
      variant={variant}
    />
  );
}

export function InfoButton({ children, text, variant }: ButtonProps) {
  return (
    <Button
      text={text}
      children={children}
      class={
        variant
          ? "text-sky-600 hover:bg-sky-600 hover:text-white"
          : "hover:text-sky-600"
      }
      variant={variant}
    />
  );
}
