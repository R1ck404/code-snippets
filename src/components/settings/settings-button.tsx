import { useState } from "react";
import { DropdownItem } from "../dropdown/dropdown";
import { Sheet } from "../sheet/sheet";

export default function SettingsButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
                te
            </Sheet>
            <DropdownItem onClick={() => setIsOpen(!isOpen)}>Settings</DropdownItem>
        </>
    )
}