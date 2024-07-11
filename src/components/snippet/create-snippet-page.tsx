import React, { useState, DragEvent, ChangeEvent } from "react";
import { Collection, useAppState } from "../../context/AppStateContext";
import Button from "../button/button";
import Input from "../input/input";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "../toaster/toaster";

interface FileData {
    name: string;
    content: string;
}

const CreateSnippetPage: React.FC = () => {
    const { isCreatingSnippet, setIsCreatingSnippet, selectedGroup, selectedCollection, setCollections } = useAppState();
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [files, setFiles] = useState<FileData[]>([]);
    const [manualEntries, setManualEntries] = useState<string[]>([""]);

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const newFiles = Array.from(event.dataTransfer.files);
        readFiles(newFiles);
    };

    const readFiles = (fileList: File[]) => {
        const newFiles: FileData[] = [];
        fileList.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                newFiles.push({ name: file.name, content });
                if (newFiles.length === fileList.length) {
                    setFiles(prevFiles => [...prevFiles, ...newFiles]);
                }
            };
            reader.readAsText(file);
        });
    };

    const handleAddManualEntry = () => {
        setManualEntries([...manualEntries, ""]);
    };

    const handleManualChange = (index: number, value: string) => {
        const updatedEntries = [...manualEntries];
        updatedEntries[index] = value;
        setManualEntries(updatedEntries);
    };

    const handleSaveManualEntry = (index: number) => {
        const content = manualEntries[index];
        const name = `Manual Snippet ${files.length + 1}`;
        setFiles([...files, { name, content }]);
        handleDeleteManualEntry(index);
    };

    const handleDeleteManualEntry = (index: number) => {
        const updatedEntries = manualEntries.filter((_, i) => i !== index);
        setManualEntries(updatedEntries);
    };

    const create_snippet = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        const snippets = [...files.map(file => file.content), ...manualEntries];

        await invoke('create_snippet', {
            groupName: selectedGroup?.name,
            collectionName: selectedCollection?.name,
            snippetName: name,
            description,
            files: snippets,
            updatedBy: 'user',
            updatedAt: new Date().toISOString(),
        }).then((e) => {
            if (e && (e as string).startsWith('Error')) {
                toast.error(e as string);
                return;
            }

            setIsCreatingSnippet(false);
            toast.success('Snippet created successfully');

            // selectedCollection?.snippets.push({
            //     name,
            //     description,
            //     files: snippets,
            //     updated_by: 'user',
            //     updated_at: new Date().toISOString(),
            // });

            setCollections((prevCollections: Collection[]) => {
                const updatedCollections = prevCollections.map((collection) => {
                    if (collection.name === selectedCollection?.name) {
                        collection.snippets.push({
                            name,
                            description,
                            files: snippets,
                            updated_by: 'user',
                            updated_at: new Date().toISOString(),
                        });
                    }
                    return collection;
                });
                return updatedCollections;
            });
        }).catch((e) => {
            toast.error('An error occurred while creating the snippet');
        });
    };

    return (
        <div className="flex flex-col w-full h-full p-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-thumb-rounded-full scrollbar-track-zinc-800">
            <div className="flex justify-between">
                <h1 className="text-white text-lg font-semibold">Create Snippet</h1>
                <Button type="button" color="dark/zinc" onClick={() => setIsCreatingSnippet(false)}>Cancel</Button>
            </div>
            <form className="flex flex-col space-y-2 mt-4" onSubmit={create_snippet}>
                <Input placeholder="Name" name="name" required minLength={1} maxLength={25} />
                <Input placeholder="Description" name="description" />

                <div
                    className={`flex flex-col items-center justify-center w-full h-64 border border-zinc-600 border-dashed rounded-xl bg-zinc-900 text-white ${isDragging ? 'border-zinc-500 opacity-50' : 'border-zinc-600'}`}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <svg height="24" strokeLinejoin="round" viewBox="0 0 16 16" width="24">
                        <path clipRule="evenodd" d="M1.5 4.875C1.5 3.01104 3.01104 1.5 4.875 1.5C6.20018 1.5 7.34838 2.26364 7.901 3.37829C8.1902 3.96162 8.79547 4.5 9.60112 4.5H12.25C13.4926 4.5 14.5 5.50736 14.5 6.75C14.5 7.42688 14.202 8.03329 13.7276 8.44689L13.1622 8.93972L14.1479 10.0704L14.7133 9.57758C15.5006 8.89123 16 7.8785 16 6.75C16 4.67893 14.3211 3 12.25 3H9.60112C9.51183 3 9.35322 2.93049 9.2449 2.71201C8.44888 1.1064 6.79184 0 4.875 0C2.18261 0 0 2.18261 0 4.875V6.40385C0 7.69502 0.598275 8.84699 1.52982 9.59656L2.11415 10.0667L3.0545 8.89808L2.47018 8.42791C1.87727 7.95083 1.5 7.22166 1.5 6.40385V4.875ZM7.29289 7.39645C7.68342 7.00592 8.31658 7.00592 8.70711 7.39645L11.7803 10.4697L12.3107 11L11.25 12.0607L10.7197 11.5303L8.75 9.56066V15.25V16H7.25V15.25V9.56066L5.28033 11.5303L4.75 12.0607L3.68934 11L4.21967 10.4697L7.29289 7.39645Z" fill="currentColor" fillRule="evenodd">
                        </path>
                    </svg>
                    <h1 className="mt-2 font-semibold">Drop your file(s) here.</h1>
                    <p className="text-zinc-500 text-sm">or</p>
                    <Button type="button" color="dark/zinc" className="w-min mt-2" onClick={handleAddManualEntry}>
                        Enter your snippet manually
                    </Button>
                </div>

                {files.map((file, index) => (
                    <div key={index} className="bg-zinc-800 text-white p-2 rounded-md">
                        <h3>{file.name}</h3>
                        <p className="text-zinc-500 text-sm">{file.content.slice(0, 100)}...</p>
                    </div>
                ))}

                {manualEntries.map((entry, index) => (
                    <div key={index} className="relative">
                        <textarea
                            placeholder={`Manual Snippet ${index + 1}`}
                            name={`manualSnippet${index}`}
                            value={entry}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleManualChange(index, e.target.value)}
                            className="bg-zinc-800 text-white p-2 rounded-md w-full"
                        />
                        <div className="flex right-1 top-1 absolute space-x-2">
                            <Button
                                type="button"
                                color="dark/zinc"
                                onClick={() => handleSaveManualEntry(index)}
                            >
                                Save
                            </Button>
                            <Button
                                type="button"
                                color="dark/zinc"
                                onClick={() => handleDeleteManualEntry(index)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}

                <Button type="submit" color="dark/zinc" className="w-full">
                    Create
                </Button>
            </form>
        </div>
    );
};

export default CreateSnippetPage;
