import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

interface ToastProps {
    type: 'message' | 'success' | 'info' | 'warning' | 'error';
    message: string;
    description?: string;
    action?: React.ReactNode;
    onClose: () => void;
    className?: string;
    style?: React.CSSProperties;
    richColors?: boolean;
    closeButton?: boolean;
}

const Toast: React.FC<ToastProps> = ({ type, message, description, action, onClose, className, style, richColors }) => {
    const toastClasses = classNames(
        'flex items-center p-4 rounded-md shadow-lg flex items-start',
        className,
        {
            'bg-blue-500 text-white': richColors && type === 'info',
            'bg-green-500 text-white': richColors && type === 'success',
            'bg-yellow-500 text-white': richColors && type === 'warning',
            'bg-red-500 text-white': richColors && type === 'error',
            'bg-gray-700 text-white': richColors && type === 'message',
        },
        "bg-secondary text-white",
        "shadow-sm shadow-[0px_4px_12px_rgba(0,0,0,0.1)]"
    );

    return (
        <div className={toastClasses} style={style}>
            <div className="flex-grow">
                <strong>{message}</strong>
                {description && <div className="text-sm">{description}</div>}
            </div>
            {action && (
                <div className="ml-4">
                    {action}
                </div>
            )}
            {onClose && (
                <button className="ml-4 mr-2 h-full flex justify-center items-center my-auto" onClick={onClose}>
                    &times;
                </button>
            )}
        </div>
    );
};

interface ToasterProps {
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    richColors?: boolean;
    outline?: boolean;
}

const Toaster: React.FC<ToasterProps> = ({ position = 'top-right', richColors = false, outline = true }) => {
    const [toasts, setToasts] = useState<any[]>([]);
    const [isHovered, setIsHovered] = useState(false);

    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
        'bottom-right': 'bottom-4 right-4',
    };

    const containerClasses = classNames(
        'fixed p-4 z-50 transition-all duration-300 ease-in-out',
        positionClasses[position]
    );

    useEffect(() => {
        const handleToastEvent = (event: CustomEvent) => {
            const toastData = event.detail;
            const existingToastIndex = toasts.findIndex((t) => t.id === toastData.id);

            if (existingToastIndex !== -1) {
                const updatedToasts = [...toasts];
                updatedToasts[existingToastIndex] = { ...updatedToasts[existingToastIndex], ...toastData };
                setToasts(updatedToasts);
            } else {
                setToasts((prevToasts) => [...prevToasts, toastData]);
            }
        };

        (window as any).addEventListener('toast', handleToastEvent);

        return () => {
            (window as any).removeEventListener('toast', handleToastEvent);
        };
    }, [toasts]);

    const removeToast = (id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className={containerClasses}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {toasts.map((toast, index) => {
                const visibleIndex = toasts.length - index - 1;
                const isVisible = isHovered || visibleIndex < 3;
                const scale = 1 - (visibleIndex * 0.05);

                return (
                    <div
                        key={toast.id + index}
                        className='transform scale-100 opacity-100 animate-in'
                        style={{
                            transition: 'transform 0.3s ease, margin-top 0.3s ease, opacity 0.3s ease',
                            transform: isHovered
                                ? 'translateX(0)'
                                : `scaleX(${scale})`,
                            marginTop: isHovered
                                ? '1rem'
                                : `-${2.5 + (3 - visibleIndex * .25) * 0.25}rem`,
                            opacity: isVisible ? 1 : 0,
                            zIndex: 100 + index,
                            pointerEvents: isVisible ? 'auto' : 'none',
                        }}
                    >
                        <Toast
                            {...toast}
                            onClose={() => removeToast(toast.id)}
                            className={`transition-all duration-300 ease-in-out ${outline ? "border border-border" : ""}`}
                        />
                    </div>
                );
            })}
        </div>
    );
};

let toastId = 0;

const createToast = (type: string, message: string, options: any = {}) => {
    const id = `toast-${toastId++}`;
    const event = new CustomEvent('toast', {
        detail: { id, type, message, ...options },
    });
    window.dispatchEvent(event);
};

const toast = {
    message: (message: string, options?: any) => createToast('message', message, options),
    success: (message: string, options?: any) => createToast('success', message, options),
    info: (message: string, options?: any) => createToast('info', message, options),
    warning: (message: string, options?: any) => createToast('warning', message, options),
    error: (message: string, options?: any) => createToast('error', message, options),
    promise: (promise: () => Promise<any>, options: any) => {
        const id = `toast-${toastId++}`;
        createToast('message', options.loading, { id });

        promise()
            .then((result) => {
                const toastData = {
                    id,
                    type: 'success',
                    message: typeof options.success === 'function' ? options.success(result) : options.success,
                };
                const event = new CustomEvent('toast', {
                    detail: toastData,
                });
                window.dispatchEvent(event);
            })
            .catch((error) => {
                const toastData = {
                    id,
                    type: 'error',
                    message: typeof options.error === 'function' ? options.error(error) : options.error,
                };
                const event = new CustomEvent('toast', {
                    detail: toastData,
                });
                window.dispatchEvent(event);
            });
    },
};

export { Toaster, toast };