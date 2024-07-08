"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, FC } from 'react';
import classNames from 'classnames';

interface ContextMenuContextType {
    menuState: {
        visible: boolean;
        position: { x: number; y: number };
    };
    showMenu: (x: number, y: number) => void;
    hideMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export const useContextMenu = () => {
    const context = useContext(ContextMenuContext);
    if (!context) {
        throw new Error("useContextMenu must be used within a ContextMenuProvider");
    }
    return context;
};

export const ContextMenu: FC<{ children: ReactNode }> = ({ children }) => {
    const [menuState, setMenuState] = useState({
        visible: false,
        position: { x: 0, y: 0 }
    });

    const showMenu = (x: number, y: number) => {
        setMenuState({ visible: true, position: { x, y } });
    };

    const hideMenu = () => {
        setMenuState({ visible: false, position: { x: 0, y: 0 } });
    };

    return (
        <ContextMenuContext.Provider value={{ menuState, showMenu, hideMenu }}>
            {children}
        </ContextMenuContext.Provider>
    );
};

export const ContextMenuTrigger: FC<{ children: ReactNode, disabled?: boolean }> = ({ children, disabled }) => {
    const { showMenu } = useContextMenu();
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault();
            if (disabled) return;
            if (event.button === 0) return;
            if (!triggerRef.current) return;
            if (document.querySelector('.context-menu')) {
                document.querySelector('.context-menu')?.remove();
            }

            showMenu(event.pageX, event.pageY);
        };

        const trigger = triggerRef.current;
        if (trigger) {
            trigger.addEventListener('contextmenu', handleContextMenu);
        }

        return () => {
            if (trigger) {
                trigger.removeEventListener('contextmenu', handleContextMenu);
            }
        };
    }, [showMenu]);

    const classes = classNames(
        {
            "opacity-50 cursor-not-allowed": disabled
        }
    );

    return <div ref={triggerRef} className={classes}>{children}</div>;
};

export const ContextMenuContent: FC<{ children: ReactNode, className?: string, outline?: boolean }> = ({ children, className, outline }) => {
    const { menuState, hideMenu } = useContextMenu();

    const classes = classNames(
        "context-menu fixed rounded-lg shadow-md z-[100] p-0.5 text-black bg-zinc-100 dark:border dark:text-white dark:bg-zinc-700 dark:border-border",
        {
            "hidden": !menuState.visible,
            "block": menuState.visible
        },
        {
            "border border-border": outline,
        },

        className,
    );

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (!event.target) return;
            const clickedElement = event.target as HTMLElement;
            if (!clickedElement.closest(".context-menu")) {
                hideMenu();
            }
        };

        if (menuState.visible) {
            document.addEventListener('click', handleClick);
        }

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [menuState.visible, hideMenu]);

    return (
        <>
            {menuState.visible && (
                <div
                    className={classes}
                    style={{
                        top: menuState.position.y,
                        left: menuState.position.x
                    }}
                >
                    {children}
                </div>
            )}
        </>
    );
};

export const ContextMenuItem: FC<{ children: ReactNode, onClick?: () => void, className?: string, disabled?: boolean }> = ({ children, onClick, className, disabled }) => {
    const { hideMenu } = useContextMenu();

    const handleClick = () => {
        if (disabled) return;
        if (onClick) onClick();
        hideMenu();
    };

    const classes = classNames(
        "flex items-center space-x-2 text-sm px-3 py-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-all cursor-pointer",
        {
            "opacity-50 !cursor-not-allowed": disabled
        },
        className
    );

    return (
        <div className={classes} onClick={handleClick}>
            {children}
        </div>
    );
};
