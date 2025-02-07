import { useCallback, useEffect } from "react";
import { LoadingOverlay } from "@mantine/core";
import Editor, { loader, type EditorProps, type OnMount, useMonaco } from "@monaco-editor/react";
import { useConfig } from "@/store/useConfig";
import { useFile } from "@/store/useFile";

loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
  }
});

const editorOptions: EditorProps["options"] = {
  formatOnPaste: true,
  tabSize: 2,
  formatOnType: true,
  minimap: { enabled: false },
  stickyScroll: { enabled: false },
  scrollBeyondLastLine: false,
  placeholder: "Start typing..."
};

export default function JsonEditor() {
  const monaco = useMonaco();
  const contents = useFile(state => state.contents);
  const setContents = useFile(state => state.setContents);
  const setError = useFile(state => state.setError);
  const jsonSchema = useFile(state => state.jsonSchema);
  const getHasChange = useFile(state => state.getHasChanges);
  const theme = useConfig(state => (state.darkModeEnabled ? "vs-dark" : "light"));
  const fileType = useFile(state => state.format);

  useEffect(() => {
    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: true,
      enableSchemaRequest: true,
      ...(jsonSchema && {
        schemas: [
          {
            uri: "http://myserver/foo-schema.json",
            fileMatch: ["*"],
            schema: jsonSchema
          }
        ]
      })
    });
  }, [jsonSchema, monaco?.languages.json.jsonDefaults]);

  useEffect(() => {
    const beforeunload = (e: BeforeUnloadEvent) => {
      if (getHasChange()) {
        const confirmationMessage = "Unsaved changes, if you leave before saving your changes will be lost";

        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", beforeunload);

    return () => {
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, [getHasChange]);

  const handleMount: OnMount = useCallback(editor => {
    editor.onDidPaste(() => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
  }, []);

  useEffect(() => {
    setContents({ contents, skipUpdate: true });
  }, []);

  return (
    <div className="flex flex-col h-full select-none">
      {/* h-[calc(100vh-67px)] */}
      <div className="grid h-full grid-cols-[100%] grid-rows-[minmax(0,1fr)]">
        <Editor
          height="100%"
          language={fileType}
          theme={theme}
          value={contents}
          options={editorOptions}
          onMount={handleMount}
          onValidate={errors => setError(errors[0]?.message)}
          onChange={contents => setContents({ contents, skipUpdate: true })}
          loading={<LoadingOverlay visible />}
        />
      </div>
    </div>
  );
}
