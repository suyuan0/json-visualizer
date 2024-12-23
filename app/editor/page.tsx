"use client";

import dynamic from "next/dynamic";

import JsonEditor from "@/components/JsonEditor";
import { useState } from "react";
import defaultJson from "@/lib/defaultJson.json";
import GridBackground from "@/components/GridBackground";

const JsonView = dynamic(() => import("@/components/JsonView"), {
  ssr: false
});

const Editor = () => {
  const [value, setValue] = useState(JSON.stringify(defaultJson, null, 2));

  return (
    <div className="flex h-screen">
      <div className="w-96">
        <JsonEditor value={value} setValueAction={setValue} />
      </div>
      <GridBackground className="flex-1 overflow-hidden">
        <JsonView value={value} />
      </GridBackground>
    </div>
  );
};

export default Editor;
