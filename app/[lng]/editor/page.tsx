"use client";

import dynamic from "next/dynamic";

import { use } from "react";
import GridBackground from "@/components/GridBackground";
import JsonEditorHeader from "@/components/JsonEditorHeader";

interface EditorPropsParams {
  lng: string;
}

const JsonView = dynamic(() => import("@/components/JsonView"), {
  ssr: false
});

const JsonEditor = dynamic(() => import("@/components/JsonEditor"), {
  ssr: false
});

const Editor = ({ params }: ClientProps<EditorPropsParams>) => {
  const { lng } = use<EditorPropsParams>(params);

  return (
    <div className="flex flex-col h-screen">
      <JsonEditorHeader lng={lng} />
      <main className="flex-1 flex">
        <div className="w-96">
          <JsonEditor />
        </div>
        <GridBackground className="flex-1 overflow-hidden">
          <JsonView />
        </GridBackground>
      </main>
    </div>
  );
};

export default Editor;
