import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Group {
    name: string;
    members: string[];
    color: string;
}

interface Collection {
    name: string;
    groups: Group[];
    snippets: CodeSnippet[];
    color: string;
}

interface CodeSnippet {
    name: string;
    description: string;
    files: string[];
    updated_by: string;
    updated_at: string;
}

interface AppStateContextType {
    groups: Group[];
    collections: Collection[];
    selectedGroup: Group | null;
    selectedCollection: Collection | null;
    selectedSnippet: CodeSnippet | null;
    isCreatingSnippet: boolean;
    setGroups: (groups: Group[]) => void;
    setCollections: (collections: Collection[]) => void;
    setSelectedGroup: (group: Group | null) => void;
    setSelectedCollection: (collection: Collection | null) => void;
    setSelectedSnippet: (snippet: CodeSnippet | null) => void;
    setIsCreatingSnippet: (isCreatingSnippet: boolean) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
    const [isCreatingSnippet, setIsCreatingSnippet] = useState(false);

    return (
        <AppStateContext.Provider
            value={{
                groups,
                collections,
                selectedGroup,
                selectedCollection,
                selectedSnippet,
                isCreatingSnippet,
                setGroups,
                setCollections,
                setSelectedGroup,
                setSelectedCollection,
                setSelectedSnippet,
                setIsCreatingSnippet
            }}
        >
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = (): AppStateContextType => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};

export type { Group, Collection, CodeSnippet };