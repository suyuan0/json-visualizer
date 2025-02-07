"use client";

import dynamic from "next/dynamic";

import GridBackground from "@/components/GridBackground";
import JsonEditorHeader from "@/components/JsonEditorHeader";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "@/constants/theme";
import { useComputedColorScheme } from "@mantine/core";
interface EditorPropsParams {
  lng: string;
}

const JsonEditor = dynamic(() => import("@/components/JsonEditor"), {
  ssr: false
});

const GraphView = dynamic(() => import("@/components/GraphView"), {
  ssr: false
});

const Editor = ({ params }: ClientProps<EditorPropsParams>) => {
  const { lng } = params;
  const colorScheme = useComputedColorScheme();

  // const { lng } = use<EditorPropsParams>(params);

  return (
    <StyledThemeProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
      <div className="flex flex-col h-screen overflow-hidden">
        <JsonEditorHeader lng={lng} />
        <main className="flex-1 flex overflow-hidden">
          <div className="w-96">
            <JsonEditor />
          </div>
          <GridBackground className="flex-1 overflow-hidden">
            <GraphView />
          </GridBackground>
        </main>
      </div>
    </StyledThemeProvider>
  );
};

export default Editor;
