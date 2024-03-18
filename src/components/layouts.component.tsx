import { BaseHtml, HTMLProps } from "./base-html.component";

export function RootLayout({ children, title, class: className }: HTMLProps) {
    return (
      <BaseHtml title={title} class={className}>
        <main class={"w-full h-full"}>{children}</main>
      </BaseHtml>
    );
}