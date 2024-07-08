import { useAppState } from "../../context/AppStateContext"

export function CreateSnippetButton() {
    const { isCreatingSnippet, setIsCreatingSnippet, selectedCollection, selectedGroup } = useAppState();

    return (
        <button className={`font-bold text-md ml-4 mb-1 text-white ${!selectedCollection ? 'hidden' : 'block'} ${!selectedGroup ? '!hidden' : '!block'}`} onClick={() => setIsCreatingSnippet(true)}>
            <p className='font-bold text-xl'>+</p>
        </button>
    )
}