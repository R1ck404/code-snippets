import { useState } from "react";
import { Dialog } from "../dialog/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import ColorPicker from "../color-picker/color-picker";
import { Collection, Group, useAppState } from "../../context/AppStateContext";
import Input from "../input/input";
import Button from "../button/button";
import { toast } from "../toaster/toaster";

export default function CreateCollectionButton({ group }: { group: Group }) {
    const { collections, setCollections } = useAppState();
    const [visible, setVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState('gray');

    const updateCollections = async () => {
        const collections = await invoke('get_collections');

        setCollections(collections as Collection[]);
    }

    const createCollection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const snippets: never[] = [];
        const groupList = [group];

        await invoke('create_collection', { name, groups: groupList, snippets: snippets, color: selectedColor }).then((e) => {
            if (e && (e as string).startsWith('Error')) {
                toast.error(e as string);
                return;
            }

            setVisible(false);
            toast.success('Collection created successfully');
            updateCollections();
        }).catch((e) => {
            toast.error('An error occurred while creating the group');
        });
    }

    return (
        <>
            <button className="font-bold text-md ml-10 mb-1" onClick={() => setVisible(!visible)}>
                <p className='font-bold text-xl'>+</p>
            </button>
            <Dialog open={visible} onClose={setVisible}>
                <h1 className="text-white text-lg font-semibold mb-2">Create Collection</h1>
                <form className="flex flex-col space-y-2" onSubmit={createCollection}>
                    <Input type="text" placeholder="Collection Name" name="name" required minLength={1} maxLength={25} />

                    <p className="text-white text-sm !mt-4">Select a color for the collection</p>
                    <div className="p-0.5 rounded-lg border border-border bg-secondary">
                        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                    </div>

                    <Button type="submit" color="dark/zinc" className="w-full">Create</Button>
                </form>
            </Dialog>
        </>
    )
}