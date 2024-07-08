import { useState } from "react";
import { Dialog } from "../dialog/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import ColorPicker from "../color-picker/color-picker";
import Input from "../input/input";
import Button from "../button/button";
import { toast } from "../toaster/toaster";
import { Group, useAppState } from "../../context/AppStateContext";

export default function CreateGroupButton() {
    const { isCreatingSnippet, setIsCreatingSnippet, groups, setGroups } = useAppState();
    const [visible, setVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState('gray');

    const createGroup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const members: never[] = [];

        await invoke('create_group', { name, members, color: selectedColor }).then((e) => {
            if (e && (e as string).startsWith('Error')) {
                toast.error(e as string);
                return;
            }

            setVisible(false);
            toast.success('Group created successfully');

            updateGroups();
        }).catch((e) => {
            toast.error('An error occurred while creating the group');
        });
    }

    const updateGroups = async () => {
        const groups = await invoke('get_groups');

        setGroups(groups as Group[]);
    }
    return (
        <>
            <button className="flex items-center justify-center w-10 h-4 text-white" onClick={() => setVisible(!visible)}>
                <p className='font-bold text-2xl'>+</p>
            </button>
            <Dialog open={visible} onClose={setVisible}>
                <h1 className="text-white text-lg font-semibold mb-2">Create Group</h1>
                <form className="flex flex-col space-y-2" onSubmit={createGroup}>
                    <Input type="text" placeholder="Group Name" name="name" required minLength={1} maxLength={25} />

                    <p className="text-white text-sm !mt-4">Select a color for the group</p>
                    <div className="p-0.5 rounded-lg border border-border bg-secondary">
                        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                    </div>

                    <Button type="submit" color="dark/zinc" className="w-full">Create</Button>
                </form>
            </Dialog>
        </>
    )
}