import React, { useState, useRef, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Separator } from '../separator/separator';

interface DropdownProps {
    children: React.ReactNode;
    className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ children, className }) => {
    return <div className={`relative inline-block ${className ?? ''}`}>{children}</div>;
};

interface DropdownTriggerProps {
    children: React.ReactNode;
    onClick?: () => void;
}

const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children, onClick }) => {
    return (
        <div onClick={onClick} className="cursor-pointer">
            {children}
        </div>
    );
};

interface DropdownMenuProps {
    isOpen: boolean;
    children: React.ReactNode;
    position?: 'left' | 'right' | 'top' | 'bottom' | 'auto';
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, children, position = 'auto' }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [computedPosition, setComputedPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');

    const calculatePosition = useCallback(() => {
        if (menuRef.current && position === 'auto') {
            const rect = menuRef.current.getBoundingClientRect();
            const { innerHeight, innerWidth } = window;

            if (rect.bottom > innerHeight) {
                setComputedPosition('top');
            } else if (rect.top < 0) {
                setComputedPosition('bottom');
            } else if (rect.right > innerWidth) {
                setComputedPosition('left');
            } else if (rect.left < 0) {
                setComputedPosition('right');
            } else {
                setComputedPosition('bottom');
            }
        } else {
            setComputedPosition(position as 'top' | 'bottom' | 'left' | 'right');
        }
    }, [position]);

    useEffect(() => {
        calculatePosition();
    }, [])

    useEffect(() => {
        if (isOpen) {
            calculatePosition();
            window.addEventListener('resize', calculatePosition);
        } else {
            window.removeEventListener('resize', calculatePosition);
        }

        return () => {
            window.removeEventListener('resize', calculatePosition);
        };
    }, [isOpen, calculatePosition]);

    const menuClasses = classNames(
        'absolute w-48 bg-zinc-700 text-color-secondary border border-border rounded-lg shadow-lg z-50 transition-all duration-250 scale-100 transform',
        {
            'opacity-100 visible scale-100': isOpen,
            'opacity-0 invisible scale-0': !isOpen,
            'left-0 mt-2 origin-top-left': computedPosition === 'bottom',
            'left-0 mb-2 bottom-full origin-bottom-left': computedPosition === 'top',
            'right-0 mr-2 origin-right-center': computedPosition === 'left',
            'left-0 ml-2 origin-left-center': computedPosition === 'right',
        }
    );

    return (
        <div ref={menuRef} className={menuClasses}>
            {children}
        </div>
    );
};

interface DropdownItemProps {
    href?: string;
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ href, onClick, children, className }) => {
    const itemClasses = 'cursor-pointer m-1 rounded-md block px-3 py-1.5 text-sm text-color-default hover:bg-background ' + (className ?? '');

    if (href) {
        return (
            <a href={href}>
                <span className={itemClasses}>{children}</span>
            </a>
        );
    }
    return (
        <div onClick={onClick} className={itemClasses}>
            {children}
        </div>
    );
};

interface DropdownHeaderProps {
    children: React.ReactNode;
    className?: string;
}

const DropdownHeader: React.FC<DropdownHeaderProps> = ({ children, className }) => {
    const finalClass = classNames('px-3 py-2 text-sm font-semibold dark:text-white text-gray-900', className);
    return <div className={finalClass}>{children}</div>;
};

interface DropdownSectionProps {
    children: React.ReactNode;
    className?: string;
}

const DropdownSection: React.FC<DropdownSectionProps> = ({ children, className }) => {
    const finalClass = classNames('', className);
    return <div className={finalClass}>{children}</div>;
};

interface DropdownHeadingProps {
    children: React.ReactNode;
    className?: string;
}

const DropdownHeading: React.FC<DropdownHeadingProps> = ({ children, className }) => {
    const finalClass = classNames('px-3 py-2 text-sm font-bold dark:text-white text-gray-900', className);
    return <div className={finalClass}>{children}</div>;
};

interface DropdownDividerProps {
    className?: string;
}

const DropdownDivider: React.FC<DropdownDividerProps> = ({ className }) => {
    return <Separator className={className} />;
};

interface DropdownLabelProps {
    children: React.ReactNode;
    className?: string;
}

const DropdownLabel: React.FC<DropdownLabelProps> = ({ children, className }) => {
    const finalClass = classNames('px-3 py-2 text-xs text-color-secondary', className);
    return <div className={finalClass}>{children}</div>;
};

interface DropdownDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

const DropdownDescription: React.FC<DropdownDescriptionProps> = ({ children, className }) => {
    const finalClass = classNames('px-3 py-2 text-sm text-color-secondary', className);
    return <div className={finalClass}>{children}</div>;
};

export {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownHeader,
    DropdownSection,
    DropdownHeading,
    DropdownDivider,
    DropdownLabel,
    DropdownDescription,
};
