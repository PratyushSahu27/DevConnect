import React, { useRef, useEffect, useState } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import * as monaco from 'monaco-editor';
// Define random user colors for cursors
const USER_COLORS = [
    '#30bced', // Blue
    '#6eeb83', // Green
    '#ffbc42', // Yellow
    '#e32e2b', // Red
    '#a239ca', // Purple
];
const CollaborativeEditor: React.FC = () => {
    const [editorRef, setEditorRef] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const providerRef = useRef<WebsocketProvider | null>(null);
    const docRef = useRef<Y.Doc | null>(null);
    const bindingRef = useRef<MonacoBinding | null>(null);

    // Cleanup function
    useEffect(() => {
        return () => {
            providerRef.current?.disconnect();
            docRef.current?.destroy();
            bindingRef.current?.destroy();
        };
    }, []);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        setEditorRef(editor);
        // 1. Initialize Yjs Doc
        const ydoc = new Y.Doc();
        docRef.current = ydoc;
        // 2. Connect to WebSocket
        // Using public demo for testing. Replace with 'ws://localhost:8080/ws' later.
        const provider = new WebsocketProvider('ws://localhost:8080/ws/collaboration', 'devconnect-demo-room', ydoc);
        providerRef.current = provider;
        const type = ydoc.getText('monaco');
        // 3. Define User Awareness (Cursor info)
        const awareness = provider.awareness;
        const randomColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
        awareness.setLocalStateField('user', {
            name: 'User-' + Math.floor(Math.random() * 100),
            color: randomColor
        });
        // 4. Bind Yjs to Monaco
        const binding = new MonacoBinding(
            type,
            editor.getModel()!,
            new Set([editor]),
            awareness
        );
        bindingRef.current = binding;
    };

    return (
        <div style={{ height: '95vh', border: '1px solid #abababff' }}>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                defaultValue="// Connect to collaborate..."
                onMount={handleEditorDidMount}
                options={{
                    automaticLayout: true,
                    minimap: { enabled: true },
                    fontSize: 14,
                }}
            />
        </div>
    );
};
export default CollaborativeEditor;