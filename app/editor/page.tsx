"use client";

import JsonEditor from "@/components/JsonEditor";
import JsonView from "@/components/JsonView";
import { useState } from "react";
import defaultJson from "@/lib/defaultJson.json";

const Editor = () => {
  const [value, setValue] = useState(JSON.stringify(defaultJson, null, 2));

  return (
    <div className="flex h-screen">
      <div className="w-96">
        <JsonEditor value={value} setValueAction={setValue} />
      </div>
      <div className="flex-1 overflow-hidden">
        <JsonView value={value} />
      </div>
    </div>
  );
};

export default Editor;
