"use client";

import dynamic from "next/dynamic";

import { useState, use } from "react";
import defaultJson from "@/lib/defaultJson.json";
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
  const [value, setValue] = useState(JSON.stringify(defaultJson, null, 2));
  const { lng } = use<EditorPropsParams>(params);

  return (
    <div className="flex flex-col h-screen">
      <JsonEditorHeader setJsonValue={setValue} lng={lng} />
      <main className="flex-1 flex">
        <div className="w-96">
          <JsonEditor value={value} setValueAction={setValue} />
        </div>
        <GridBackground className="flex-1 overflow-hidden">
          <JsonView value={value} />
        </GridBackground>
      </main>
    </div>
  );
};

export default Editor;
