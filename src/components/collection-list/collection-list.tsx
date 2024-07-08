import { invoke } from "@tauri-apps/api/tauri";
import { Collection, Group, useAppState } from "../../context/AppStateContext";
import { useEffect, useState } from "react";
import { stringToTailwindHex } from "../../utils/color_utils";
import CreateCollectionButton from "./create-collection-button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../context-menu/context-menu";
import { Separator } from "../separator/separator";
import { toast } from "../toaster/toaster";
import { Alert, AlertTitle, AlertDescription, AlertActions } from "../alert/alert";
import Button from "../button/button";

export default function CollectionList() {
    const { collections, setCollections, selectedCollection, setSelectedCollection, selectedGroup } = useAppState();
    const [selectedGroupCollections, setSelectedGroupCollections] = useState<Collection[]>([]);
    const [currentCollectionAction, setCurrentCollectionAction] = useState<string>('');

    const getCollections = async () => {
        const collections = await invoke('get_collections');

        setCollections(collections as Collection[]);
    }

    useEffect(() => {
        getCollections();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            setSelectedGroupCollections(collections.filter((collection) => collection.groups.some((group) => group.name === selectedGroup.name)));
        }
    }, [selectedGroup, collections]);

    const setIsOpen = (isOpen: boolean) => {
        setCurrentCollectionAction('');
    }

    const deleteCollection = async (collectionName: string) => {
        await invoke('delete_collection', { name: collectionName }).then((e) => {
            if (e && (e as string).startsWith('Error')) {
                toast.error(e as string);
                return;
            }

            getCollections();
            setSelectedCollection(null);
            setIsOpen(false);
            toast.success('Collection deleted successfully');
        });
    }

    return (
        <>
            <Alert open={currentCollectionAction !== ''} onClose={setIsOpen} outline={false} className='text-white'>
                <AlertTitle>Are you sure</AlertTitle>
                <AlertDescription>
                    Are you sure you want to delete this collection? This action cannot be undone.
                </AlertDescription>
                <AlertActions>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button variant="default" color='rose' onClick={() => deleteCollection(currentCollectionAction)}>Delete</Button>
                </AlertActions>
            </Alert>
            <div className="flex flex-col h-screen w-auto p-4 bg-[#1e1f21]">
                <div className="flex justify-between items-center text-white">
                    <div className="flex items-center space-x-2">
                        <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
                            <path clipRule="evenodd" d="M13.5 4V6H2.5V2.5H6L7.33333 3.5C7.76607 3.82456 8.29241 4 8.83333 4H13.5ZM1 6V2.5V1H2.5H6.16667C6.38304 1 6.59357 1.07018 6.76667 1.2L8.23333 2.3C8.40643 2.42982 8.61696 2.5 8.83333 2.5H13.5H15V4V6H16L15.8333 7.5L15.2471 12.7761C15.1064 14.0422 14.0363 15 12.7624 15H3.23761C1.96373 15 0.893573 14.0422 0.752898 12.7761L0.166667 7.5L0 6H1ZM14 7.5H2H1.6759L2.24372 12.6104C2.29999 13.1169 2.72806 13.5 3.23761 13.5H12.7624C13.2719 13.5 13.7 13.1169 13.7563 12.6104L14.3241 7.5H14Z" fill="currentColor" fillRule="evenodd">
                            </path>
                        </svg>
                        <h1 className="text-sm font-semibold uppercase">Collections</h1>
                    </div>
                    <div className={`flex items-center space-x-2 ${selectedGroup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <CreateCollectionButton group={selectedGroup ?? {
                            name: 'No group selected',
                            color: 'gray',
                            members: [],
                        }} />
                    </div>
                </div>

                <ul className="flex flex-col space-y-1 mt-4">
                    {selectedGroup && selectedGroupCollections.map((collection) => {
                        return (
                            <ContextMenu key={collection.name}>
                                <ContextMenuTrigger>

                                    <li key={collection.name} className={`flex items-center space-x-2 py-1 px-2 bg-transparent hover:bg-zinc-800 rounded-lg cursor-pointer ${selectedCollection && selectedCollection.name === collection.name ? 'bg-zinc-900' : ''}`} onClick={() => setSelectedCollection(collection)}>
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stringToTailwindHex(collection.color) }}></div>
                                        <h1 className="text-white text-sm  text-ellipsis overflow-hidden max-w-28">{collection.name}</h1>
                                    </li>
                                </ContextMenuTrigger>
                                <ContextMenuContent className="space-y-1 min-w-40" outline>
                                    <ContextMenuItem>Edit</ContextMenuItem>
                                    <Separator className='!border-border' />
                                    <ContextMenuItem onClick={() => setCurrentCollectionAction(collection.name)}>Delete</ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>

                        );
                    })}
                    {selectedGroup && selectedGroupCollections.length === 0 && (
                        <li className="flex items-center space-x-2 py-1 px-2 bg-transparent rounded-lg">
                            <h1 className="text-white text-sm">No collections found</h1>
                        </li>
                    )}

                    {!selectedGroup && (
                        <li className="flex items-center space-x-2 py-1 px-2 bg-transparent rounded-lg">
                            <h1 className="text-white text-sm">No group selected</h1>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
}