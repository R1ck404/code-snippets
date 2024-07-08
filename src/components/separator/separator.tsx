"use client";

import React from 'react';
import classNames from 'classnames';

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
    soft?: boolean;
    vertical?: boolean;
}

const Separator: React.FC<SeparatorProps> = ({
    soft = false,
    vertical = false,
    className,
    ...props
}) => {
    const classes = classNames(
        {
            "bg-zinc-800 border-border text-border": !soft,
            "bg-zinc-800 border-border text-border bg-opacity-25": soft,
            "w-auto w-full h-px": !vertical,
            "h-auto h-full w-px": vertical,
            "block": !vertical,
            "inline-block": vertical
        },
        className
    );

    if (vertical) {
        return (
            <span className={classes} {...props} />
        );
    }

    return (
        <hr className={classes} {...props} />
    );
};

export { Separator };
