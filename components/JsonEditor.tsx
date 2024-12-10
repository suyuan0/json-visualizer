"use client";

import MonacoEditor, { type EditorProps } from "@monaco-editor/react";

interface Props {
  value: string;
  setValueAction: (value: string) => void;
}

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

export default function JsonEditor({ value, setValueAction }: Props) {
  const handleChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      try {
        JSON.parse(newValue); // 尝试解析 JSON
        setValueAction(newValue); // 如果没有抛出错误，更新状态
      } catch (error) {
        // 如果有错误，可以在这里处理错误，例如显示错误信息
        console.error("JSON 解析错误:", String(error));
      }
    }
  };

  return (
    <MonacoEditor
      height="100%"
      language="json"
      theme="vs-dark"
      defaultValue={value}
      options={editorOptions}
      onChange={handleChange}
    />
  );
}
