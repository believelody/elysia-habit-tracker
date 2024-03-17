export type ButtonProps = {
    children?: JSX.Element | JSX.Element[];
    text?: string;
}

export function ClassicButton({ children, text}: ButtonProps) {
    return <button class="hover:text-sky-700">
        {
            text ?? children
        }
    </button>;
}