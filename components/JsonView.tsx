import jsonViewTree from "@/utils/jsonViewTree";
import { useEffect, useState, useRef } from "react";
import panzoom from "panzoom";

interface Props {
  value: string;
}

export default function JsonView({ value }: Props) {
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const json = JSON.parse(value);
      const content = jsonViewTree(json);
      setSvgContent(content);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Invalid JSON input.");
    }
  }, [value]);

  useEffect(() => {
    // 使用 Panzoom 初始化缩放和平移
    if (svgRef.current) {
      const element = svgRef.current;
      const instance = panzoom(element, {
        zoomSpeed: 0.1, // 缩放速度
        maxZoom: 5, // 最大缩放倍数
        minZoom: 0.5, // 最小缩放倍数
      });

      return () => {
        instance.dispose(); // 清除 Panzoom 实例，避免内存泄漏
      };
    }
  }, []);

  return (
    <div className="text-black">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div ref={svgRef} style={{ border: "1px solid black", overflow: "hidden", width: "100%", height: "600px" }}>
          <svg width="100%" height="100%">
            <foreignObject width="100%" height="100%">
              <div dangerouslySetInnerHTML={{ __html: svgContent }} />
            </foreignObject>
          </svg>
        </div>
      )}
    </div>
  );
}
