import { useEffect, useState } from "react";
import { useAppState } from "../../context/AppStateContext";
import { Avatar } from "../avatar/avatar";
import { differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';

function formatTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();

    const minutesDiff = differenceInMinutes(now, date);
    const hoursDiff = differenceInHours(now, date);
    const daysDiff = differenceInDays(now, date);

    if (daysDiff > 0) {
        return `${daysDiff}d`;
    } else if (hoursDiff > 0) {
        return `${hoursDiff}h`;
    } else if (minutesDiff > 0) {
        return `${minutesDiff}m`;
    } else {
        return 'just now';
    }
}


export default function SnippetList() {
    const { groups, setGroups, selectedGroup, setSelectedGroup, selectedCollection, setSelectedCollection, selectedSnippet, setSelectedSnippet } = useAppState();
    const [snippets, setSnippets] = useState(selectedCollection ? selectedCollection.snippets : []);

    useEffect(() => {
        setSnippets(selectedCollection ? selectedCollection.snippets : []);
    }, [selectedCollection]);

    return (
        <div className="flex flex-col p-5 min-w-64 max-w-64 border-r border-r-zinc-800 h-full sticky top-0">
            <div className="flex items-center w-full justify-between space-x-2">
                <h1 className="text-lg font-semibold text-white text-nowrap max-w-48 text-ellipsis overflow-hidden">
                    {selectedGroup && selectedCollection ? selectedCollection.name : 'No collection selected'}
                </h1>
                <p className="text-sm text-zinc-500">
                    ({selectedGroup && selectedCollection ? selectedCollection.snippets.length : 0})
                </p>
            </div>

            <ul className="flex flex-col space-y-1 mt-3">
                {snippets.map((snippet, index) => {
                    const formattedTimeAgo = formatTimeAgo(snippet.updated_at);
                    return <li key={index} className={`flex text-white px-2 py-1.5 rounded-lg ${selectedSnippet && selectedSnippet.name === snippet.name ? 'bg-zinc-800' : ''} cursor-pointer`} onClick={() => setSelectedSnippet(snippet)}>
                        {/* <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
                            <path clipRule="evenodd" d="M0 2.5C0 1.11929 1.11929 0 2.5 0H13.5C14.8807 0 16 1.11929 16 2.5V13.5C16 14.8807 14.8807 16 13.5 16H2.5C1.11929 16 0 14.8807 0 13.5V2.5ZM12.125 9.5C11.9179 9.5 11.75 9.66789 11.75 9.875C11.75 10.0821 11.9179 10.25 12.125 10.25C13.1605 10.25 14 11.0895 14 12.125C14 13.1605 13.1605 14 12.125 14H10.5V12.5H12.125C12.3321 12.5 12.5 12.3321 12.5 12.125C12.5 11.9179 12.3321 11.75 12.125 11.75C11.0895 11.75 10.25 10.9105 10.25 9.875C10.25 8.83947 11.0895 8 12.125 8H13.5V9.5H12.125ZM5 9.5H6.25V14H7.75V9.5H9V8H7H5V9.5Z" fill="currentColor" fill-rule="evenodd">
                            </path>
                        </svg> */}
                        <div className="flex flex-col">
                            <h1 className="text-white text-md font-semibold leading-4 truncate max-w-36">{snippet.name}</h1>
                            <p className="text-zinc-400 text-sm mt-2 text-ellipsis overflow-hidden max-w-40 max-h-16">{snippet.description}</p>
                        </div>
                        <div className="flex flex-col ml-auto items-center mt-auto">
                            <Avatar size='6' initials={snippet.updated_by.charAt(0).toLocaleUpperCase()} />
                            <p className="text-zinc-500 text-xs mt-1">
                                {formattedTimeAgo}
                            </p>
                        </div>
                    </li>
                })}
            </ul>
        </div>
    );
}