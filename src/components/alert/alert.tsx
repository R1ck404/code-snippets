import React, { useEffect, useState } from "react";
import classNames from "classnames";

export interface AlertProps {
    open: boolean;
    outline?: boolean;
    onClose: (isOpen: boolean) => void;
    className?: string;
    children: React.ReactNode;
}

const Alert = ({ open, onClose, className, children, outline }: AlertProps) => {
    const [visible, setVisible] = useState(open);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (open) {
            setVisible(true);
            setTimeout(() => setAnimate(true), 10);
        } else {
            setAnimate(false);
            setTimeout(() => setVisible(false), 300);
        }
    }, [open]);

    const handleClose = () => {
        onClose(false);
    };

    return (
        <>
            {visible && (
                <div className={classNames("fixed inset-0 z-50 overflow-y-auto flex justify-center items-center", className)}>
                    <div
                        className={`fixed inset-0 bg-black transition-opacity duration-300 ${animate ? "opacity-30" : "opacity-0"
                            }`}
                        onClick={handleClose}
                    ></div>
                    <div
                        className={`relative bg-background rounded-lg p-6 max-w-md w-full transition-all duration-300 ${outline ? " border border-border" : ""} ${animate ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            }`}
                    >
                        <div className="flex justify-between items-center text-color-default">
                            <div className="w-full">{children}</div>
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={handleClose}
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const AlertTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <h2 className={classNames("text-lg font-semibold text-color-default", className)}>{children}</h2>;
};

const AlertDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <p className={classNames("text-sm text-color-secondary", className)}>{children}</p>;
};

const AlertActions = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={classNames("flex justify-end mt-4", className)}>{children}</div>;
}

export { Alert, AlertTitle, AlertDescription, AlertActions };