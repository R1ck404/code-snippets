import { useEffect, useState } from "react";
import { Collection, Group, useAppState } from "../../context/AppStateContext";
import { CreateSnippetButton } from "./create-snippet-button";

export default function Navbar({ className }: { className?: string }) {
    const { selectedCollection, selectedGroup, selectedSnippet, collections, groups, setSelectedCollection, setSelectedGroup, setSelectedSnippet } = useAppState();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const filteredResults = () => {
        const filteredCollections = collections.filter(collection =>
            collection.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const filteredGroups = groups.filter(group =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const filteredSnippets = collections.flatMap(collection =>
            collection.snippets.filter(snippet =>
                snippet.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        return {
            collections: filteredCollections,
            groups: filteredGroups,
            snippets: filteredSnippets,
        };
    };

    useEffect(() => {
        //check for 'esc' key press
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsFocused(false);
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    return (
        <nav className={`flex justify-between items-center h-14 w-full px-4 border-b border-b-zinc-800 ${className ?? ''}`}>
            <div className={`absolute top-0 left-0 w-screen h-screen bg-black/50 transition-opacity ${isFocused ? "visible opacity-100" : "invisible opacity-0"}`} onClick={() => setIsFocused(false)}></div>
            <div className="relative text-zinc-500 w-full h-auto"
                onFocus={() => setIsFocused(true)}
            >
                <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" className="absolute top-2 pointer-events-none ml-2">
                    <path clipRule="evenodd" d="M1.5 6.5C1.5 3.73858 3.73858 1.5 6.5 1.5C9.26142 1.5 11.5 3.73858 11.5 6.5C11.5 9.26142 9.26142 11.5 6.5 11.5C3.73858 11.5 1.5 9.26142 1.5 6.5ZM6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C8.02469 13 9.42677 12.475 10.5353 11.596L13.9697 15.0303L14.5 15.5607L15.5607 14.5L15.0303 13.9697L11.596 10.5353C12.475 9.42677 13 8.02469 13 6.5C13 2.91015 10.0899 0 6.5 0Z" fill="currentColor" fillRule="evenodd">
                    </path>
                </svg>
                <input
                    type="text"
                    placeholder="Find by collection, tag, code..."
                    className={`border-none ring-0 px-2 py-1 w-full pl-8 placeholder:text-zinc-600 focus:ring-0 focus:outline-none ${isFocused && filteredResults && filteredResults().snippets.length > 0 ? 'bg-[#1e1f21] rounded-t-lg' : 'bg-transparent '}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}

                />

                {isFocused && filteredResults && filteredResults().snippets.length > 0 && (
                    <div className="absolute bg-[#1e1f21] z-10 text-white p-1 w-full rounded-b-lg">
                        <ul className="space-y-1">
                            {filteredResults().snippets.map(snippet => (
                                <li key={snippet.name} className="flex items-center justify-between px-2 py-1.5 bg-background rounded-md cursor-pointer" onClick={() => {
                                    setSelectedSnippet(snippet);
                                    setIsFocused(false);
                                }}>
                                    <p className="text-white text-md">
                                        {snippet.name.charAt(0).toUpperCase() + snippet.name.slice(1)}
                                    </p>
                                    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
                                        <path clipRule="evenodd" d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z" fill="currentColor" fill-rule="evenodd">
                                        </path>
                                    </svg>
                                </li>
                            ))}
                            {filteredResults().snippets.length === 0 && (
                                <li className="px-2 py-1.5 bg-background rounded-md">
                                    <p className="text-white text-md">
                                        No snippets found
                                    </p>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
            <CreateSnippetButton />
            {/* <div>
                <h2>Filtered Collections</h2>
                <ul>
                    {filteredResults().collections.map(collection => (
                        <li key={collection.name}>
                            <button onClick={() => handleSelectCollection(collection)}>{collection.name}</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Filtered Groups</h2>
                <ul>
                    {filteredResults().groups.map(group => (
                        <li key={group.name}>
                            <button onClick={() => handleSelectGroup(group)}>{group.name}</button>
                        </li>
                    ))}
                </ul>
            </div> */}
            {/* Example of using filteredResults to display filtered snippets */}


        </nav>
    );
}