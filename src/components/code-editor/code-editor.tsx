import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import Editor from '@monaco-editor/react';
import { detectLanguage } from '../../utils/editor_utils';
import { appWindow } from '@tauri-apps/api/window';

export default function CodeEditor({ content }: { content: string }) {
    const editorRef = useRef(null);
    const [width, setWidth] = useState(0);

    function setEditorTheme(monaco: any) {
        monaco.editor.defineTheme('onedark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                {
                    token: 'comment',
                    foreground: '#5d7988',
                    fontStyle: 'italic'
                },
                { token: 'constant', foreground: '#e06c75' }
            ],
            colors: {
                'editor.background': '#0c0c0d'
            }
        });
    }

    const language = detectLanguage(content);

    const contentLines = content.split('\n').length;
    const minHeight = 4;
    const maxHeight = 30;
    // const editorHeight = contentLines * 1.2;
    const editorHeight = Math.min(Math.max(contentLines * 1.2, minHeight), maxHeight);

    return (
        <Editor
            height={editorHeight + 'rem'}
            language={language}
            defaultValue={content}
            options={{ readOnly: true, domReadOnly: true }}
            onChange={(value) => console.log(value)}
            beforeMount={setEditorTheme}
            theme="onedark"
            className={`h-full !rounded-b-xl overflow-y-hidden absolute left-0 top-0`}
        />
    )
}