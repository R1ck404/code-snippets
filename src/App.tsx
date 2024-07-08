import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import Sidebar from "./components/sidebar/sidebar";
import CollectionList from "./components/collection-list/collection-list";
import Navbar from "./components/navbar/navbar";
import SnippetList from "./components/snippet-list/snippet-list";
import { Toaster } from "./components/toaster/toaster";
import { useAppState } from "./context/AppStateContext";
import CreateSnippetPage from "./components/snippet/create-snippet-page";
import SnippetView from "./components/snippet/snippet-view";
import { appWindow } from "@tauri-apps/api/window";

function App() {
    const { isCreatingSnippet, setIsCreatingSnippet } = useAppState();
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const handleFullScreen = () => {
            appWindow.isMaximized().then((maximized) => {
                setIsFullScreen(maximized);
            });
        };

        handleFullScreen();

        window.addEventListener("resize", handleFullScreen);

        return () => {
            window.removeEventListener("resize", handleFullScreen);
        };
    }, []);

    return (
        <main className={`flex dark overflow-hidden ${isFullScreen ? "rounded-none" : "rounded-xl "}`}>
            <Toaster position="bottom-right" />
            <Sidebar />
            <CollectionList />

            <div className="absolute top-0 left-0 w-full h-2.5 flex items-center justify-center group">
                <div className="w-20 h-1.5 -mt-0.5 bg-zinc-800 rounded-full cursor-pointer transition-all invisible opacity-0 group-hover:mt-1 group-hover:opacity-100 group-hover:visible"
                    onMouseDown={() => {
                        appWindow.startDragging();
                    }}
                ></div>
            </div>

            <section className="flex flex-col w-full h-screen bg-[#131415]">
                <Navbar />
                <div className="flex h-full overflow-y-hidden ">
                    <SnippetList />
                    {isCreatingSnippet && (
                        <CreateSnippetPage />
                    )}

                    {!isCreatingSnippet && (
                        <SnippetView />
                    )}
                </div>
            </section>
        </main>
    );
}

export default App;
