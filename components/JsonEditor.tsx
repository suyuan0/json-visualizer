"use client";

import MonacoEditor, { type EditorProps } from "@monaco-editor/react";

const editorOptions: EditorProps["options"] = {
  formatOnPaste: true,
  formatOnType: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  stickyScroll: {
    enabled: false
  },
  tabSize: 2
};

interface Props {
  value: string;
  setValueAction: (value: string) => void;
}

export default function JsonEditor({ value, setValueAction }: Props) {
  return (
    <MonacoEditor
      height="100%"
      language="json"
      theme="vs-dark"
      defaultValue={value}
      options={editorOptions}
      onChange={e => {
        setValueAction(e ?? "");
      }}
    />
  );
}
