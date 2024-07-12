import { PropsWithChildren } from "react";

interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sheet({ isOpen, onClose, children }: PropsWithChildren<SheetProps>) {
    return (
        <>
            <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-all ${isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}`} onClick={onClose}></div>
            <div className={`fixed inset-y-0 right-0 z-50 w-80 bg-zinc-800 shadow-lg transition-all transform duration-300 rounded-lg border border-border ${isOpen ? "translate-x-0 m-1" : "translate-x-full m-0"}`}>
                <button onClick={onClose} className="absolute top-2 right-2 text-zinc-100">
                    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16"><path fillRule="evenodd" clipRule="evenodd" d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z" fill="currentColor"></path></svg>
                </button>
                {children}
            </div>
        </>
    );
}