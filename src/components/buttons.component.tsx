export type ButtonProps = {
  children?: JSX.Element | JSX.Element[];
  text?: string;
};

export function PrimaryButton({ children, text }: ButtonProps) {
  return (
    <button
      class={
        "px-3 py-2 rounded border text-sky-600 hover:bg-sky-600 hover:text-white"
      }
    >
      {text ?? children}
    </button>
  );
}

export function DangerButton({ children, text }: ButtonProps) {
  return <button class="hover:text-red-700">{text ?? children}</button>;
}
