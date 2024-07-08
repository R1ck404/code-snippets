import React, { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

import colors from 'tailwindcss/colors';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    color?: 'dark' | "light" | "dark/white" | "dark/zinc" | "unknown" | keyof typeof colors;
    align?: "start" | "center" | "end";
    href?: string;
    loading?: boolean;
}

const Button = ({
    children,
    className,
    disabled = false,
    variant = "default",
    color = "unknown",
    align = "center",
    href,
    loading,
    ...rest
}: ButtonProps) => {
    const colorClasses = colors[color as keyof typeof colors];
    const classes = classNames(
        "text-nowrap w-fit text-sm font-semibold inline-flex items-center px-3 py-1.5 rounded-md isolate transition-all duration-200 ease-in-out font-semibold space-x-2 border border-transparent",
        {
            "text-white bg-zinc-900 hover:bg-zinc-800 dark:border dark:text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:border-border": color === "dark/zinc",
            "text-white bg-zinc-900 hover:bg-zinc-800 dark:border dark:text-black dark:bg-white dark:hover:bg-neutral-200 dark:border-border": color === "dark/white",
            "text-white border bg-zinc-700 hover:bg-zinc-600 border-border": color === "dark",
            "text-black bg-white hover:bg-neutral-200 border border-border": color === "light",
        },
        {
            "text-black dark:text-white bg-transparent border border-border dark:hover:bg-zinc-700/50 hover:bg-zinc-200/50": variant === "outline",
            "text-black dark:text-white bg-transparent border border-transparent dark:hover:bg-zinc-700/50 hover:bg-zinc-200/50": variant === "ghost",
        },
        {
            "cursor-not-allowed opacity-50": disabled,
        },
        {
            "justify-start": align === "start",
            "justify-center": align === "center",
            "justify-end": align === "end",
        },
        {
            "cursor-not-allowed bg-opacity-50": loading,
        },
        className
    );

    const style = {
        backgroundColor: colorClasses ? (loading ? colorClasses[500] + "95" : colorClasses[500]) : color,
        color: colorClasses ? "white" : "",
    };

    if (loading) {
        return (
            <button className={classes} disabled={true} {...rest} style={style}>
                <svg className="animate-spin  h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </button>
        );
    }

    if (href) {
        return (
            <a href={href}>
                <button className={classes} disabled={disabled} {...rest} style={style}>
                    {children}
                </button>
            </a>
        );
    }

    return (
        <button className={classes} disabled={disabled} {...rest} style={style}>
            {children}
        </button>
    );
};

export default Button;
