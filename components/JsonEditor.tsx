// "use client";

import MonacoEditor, { type EditorProps } from "@monaco-editor/react";
import useTheme from "@/hooks/useTheme";
import { useJson } from "@/store/useJson";

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

export default function JsonEditor() {
  const { theme } = useTheme();
  const { content, setContent } = useJson();

  const themeMap = {
    dark: "vs-dark",
    light: "light"
  };

  const handleChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      try {
        JSON.parse(newValue); // 尝试解析 JSON
        setContent(newValue);
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
      theme={themeMap[theme]}
      value={content}
      options={editorOptions}
      onChange={handleChange}
    />
  );
}
