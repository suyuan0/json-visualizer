import jsonViewTree from "@/utils/jsonViewTree";
import { useEffect, useState } from "react";

interface Props {
  value: string;
}

export default function JsonView({ value }: Props) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    const content = jsonViewTree(JSON.parse(value));
    setSvgContent(content);
  }, [value]);

  return (
    <div className="text-black">
      <div dangerouslySetInnerHTML={{ __html: svgContent }}></div>
    </div>
  );
}
