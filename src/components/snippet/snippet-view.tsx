import { useAppState } from "../../context/AppStateContext";
import { Avatar } from "../avatar/avatar";
import CodeEditor from "../code-editor/code-editor";
import { Separator } from "../separator/separator";
import { toast } from "../toaster/toaster";

export default function SnippetView() {
    const { selectedSnippet } = useAppState();

    return (
        <div className="flex flex-col w-full h-full p-5">
            {selectedSnippet ? (
                <div className="overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-thumb-rounded-full scrollbar-track-zinc-800">
                    <div className="w-full flex items-center justify-between">
                        <h1 className="font-bold text-xl text-white">{selectedSnippet.name}</h1>
                        <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
                            <path clipRule="evenodd" d="M4 8C4 8.82843 3.32843 9.5 2.5 9.5C1.67157 9.5 1 8.82843 1 8C1 7.17157 1.67157 6.5 2.5 6.5C3.32843 6.5 4 7.17157 4 8ZM9.5 8C9.5 8.82843 8.82843 9.5 8 9.5C7.17157 9.5 6.5 8.82843 6.5 8C6.5 7.17157 7.17157 6.5 8 6.5C8.82843 6.5 9.5 7.17157 9.5 8ZM13.5 9.5C14.3284 9.5 15 8.82843 15 8C15 7.17157 14.3284 6.5 13.5 6.5C12.6716 6.5 12 7.17157 12 8C12 8.82843 12.6716 9.5 13.5 9.5Z" fill="currentColor" fill-rule="evenodd">
                            </path>
                        </svg>
                    </div>
                    <p className="text-zinc-500 text-sm">{selectedSnippet.files.length} file(s)</p>
                    <p className="text-zinc-500 mt-3">{selectedSnippet.description}</p>

                    <h1 className="font-bold text-xl text-white mt-5">Files</h1>
                    <div className="flex flex-col gap-5 mt-2 overflow-x-hidden relative">
                        {selectedSnippet.files.map((file, index) => (
                            <div className="w-full relative overflow-x-hidden flex flex-col" key={index}>
                                <div className="flex justify-between items-center bg-[#0c0c0d] py-2 px-3 rounded-t-lg border-b border-b-[#131415] text-white">
                                    <p className="font-semibold">Snippet #{index + 1}</p>

                                    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" className="cursor-pointer" onClick={() => {
                                        toast.success('Copied to clipboard');
                                        navigator.clipboard.writeText(file);
                                    }}>
                                        <path clipRule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z" fill="currentColor" fillRule="evenodd">
                                        </path>
                                    </svg>
                                </div>
                                <CodeEditor key={index} content={file} />
                            </div>
                        ))}
                    </div>
                    <Separator className="my-4" />

                    <div className="flex items-center">
                        <Avatar size="8" initials={selectedSnippet?.updated_by.charAt(0).toLocaleUpperCase()} className="text-white" />
                        <p className="text-zinc-500 ml-3">{selectedSnippet?.updated_by}</p>
                        <p className="text-zinc-500 ml-auto">{selectedSnippet?.updated_at.split('T')[0]}</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">Select a snippet to view</p>
                </div>
            )}
        </div>
    );
}