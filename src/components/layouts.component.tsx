import { BaseHtml, HTMLProps } from "./base-html.component";

export function RootLayout({ children, title }: HTMLProps) {
    return (
        <BaseHtml title={title}>{children}</BaseHtml>
    )
}