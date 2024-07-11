import { useEffect, useRef, useState } from "react";
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
import * as Y from "yjs"
import { WebrtcProvider } from "y-webrtc"

function App() {
    const { isCreatingSnippet, setIsCreatingSnippet, currentCollaborationSession, groups, setGroups, collections, setCollections } = useAppState();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [rtcProvider, setRtcProvider] = useState<WebrtcProvider | null>(null);
    const isInitialSync = useRef(true);
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

    useEffect(() => {
        if (!currentCollaborationSession) return;

        const doc = new Y.Doc();
        const provider = new WebrtcProvider(currentCollaborationSession.sessionId, doc);
        const groupsArray = doc.getArray("groups");
        const collectionsArray = doc.getArray("collections");

        setRtcProvider(provider);

        provider.on('status', (event) => {
            console.log('WebRTC provider status:', event.connected); // lgs 'connected' or 'disconnected'
        });

        provider.on('synced', (isSynced) => {
            console.log('WebRTC provider synced:', isSynced);
        });

        if (currentCollaborationSession.isCreator) {
            console.log("Creating new session");
            groupsArray.insert(0, groups);
            collectionsArray.insert(0, collections);
            console.log("Inserted collections", collections);
            console.log("Inserted groups", groups);
        } else {
            console.log("Joining existing session");
            groupsArray.observe((event) => {
                // if (isInitialSync.current) {
                //     isInitialSync.current = false;
                //     console.log("Initial sync, skipping state update");
                //     return;
                // }
                console.log("Received update", event);
                console.log("Received groups", groupsArray.toArray());
                setGroups(groupsArray.toArray() as any);
            });

            collectionsArray.observe((event) => {
                // if (isInitialSync.current) {
                //     isInitialSync.current = false;
                //     console.log("Initial sync, skipping state update");
                //     return;
                // }
                console.log("Received update", event);
                console.log("Received collections", collectionsArray.toArray());
                setCollections(collectionsArray.toArray() as any);
            });
        }

        return () => {
            provider.disconnect();
            doc.destroy();
        };
    }, [currentCollaborationSession]);

    useEffect(() => {
        console.log("infinite loop check", rtcProvider, groups)
        if (!rtcProvider || !groups) return;

        if (currentCollaborationSession?.isCreator) {
            const type = rtcProvider.doc.getArray("groups");
            type.delete(0, type.length);
            type.insert(0, groups);
            console.log("Updated groups", groups);
        }
    }, [groups, rtcProvider, currentCollaborationSession?.isCreator]);

    useEffect(() => {
        console.log("infinite loop check", rtcProvider, collections)
        if (!rtcProvider || !collections) return;

        if (currentCollaborationSession?.isCreator) {
            const type = rtcProvider.doc.getArray("collections");
            type.delete(0, type.length);
            type.insert(0, collections);
            console.log("Updated collections", collections);
        }
    }, [collections, rtcProvider, currentCollaborationSession?.isCreator]);

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
