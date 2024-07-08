import React, { HTMLAttributes, InputHTMLAttributes } from "react";
import classNames from "classnames";

import colors from 'tailwindcss/colors';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    color?: 'dark' | "light" | "dark/white" | "dark/zinc" | "unknown" | keyof typeof colors;
    disabled?: boolean;
    rounded?: boolean;
    bordered?: boolean;
    size?: number;
    icon?: React.ReactNode;
    className?: string;
    suffix?: React.ReactNode;
    prefix?: React.ReactNode;
}

const Input = ({
    color = "dark/zinc",
    disabled = false,
    rounded = true,
    bordered = true,
    size = 1,
    icon,
    className,
    suffix,
    prefix,
    ...rest
}: InputProps) => {
    const colorClasses = colors[color as keyof typeof colors];
    const baseColor = colorClasses ? colorClasses[500] : color;

    const classes = classNames(
        "relative w-full w-full transition-all duration-200 ease-in-out border border-border outline-none flex items-center justify-between",
        {
            "bg-white text-black dark:bg-zinc-800 dark:text-white": true,
            "border": bordered,
            "rounded-md": rounded,
            "rounded-sm": !rounded,
            "opacity-50 cursor-not-allowed": disabled,
            "focus:outline-none": !disabled,
            "focus:border": !disabled,
            [`focus:border-${baseColor}`]: !disabled,
        },
        className
    );

    const inputClasses = classNames(
        "w-full bg-transparent focus:outline-none p-2",
        {
            "text-sm py-1 px-2": size === 1,
            "text-base py-2 px-3": size === 2,
            "text-lg py-3 px-4": size === 3,
        },
    )

    return (
        <div className={classNames(classes, {
            "pl-10": icon,
        })}>
            {prefix && (
                <div className="flex justify-center items-center h-full w-fit rounded-lg">
                    {prefix}
                </div>
            )}

            {icon && (
                <span className="absolute inset-y-0 left-0 flex items-center">
                    {icon}
                </span>
            )}

            <input
                className={inputClasses}
                disabled={disabled}
                {...rest}
            />

            {suffix && (
                <div className="flex justify-center items-center h-full w-fit rounded-lg">
                    {suffix}
                </div>
            )}
        </div>
    );
};

export default Input;
