import { useEffect, useRef } from "react";
import panzoom from "panzoom";
import clsx from "clsx";

import { useJsonGraph } from "@/hooks/useJsonGraph";
import useTheme from "@/hooks/useTheme";

interface Props {
  value: string;
}

export default function JsonView({ value }: Props) {
  const svgRef = useRef<HTMLDivElement>(null);

  const { nodes, edges } = useJsonGraph(value);
  const { theme } = useTheme();

  useEffect(() => {
    // 使用 Panzoom 初始化缩放和平移
    if (svgRef.current) {
      const element = svgRef.current;
      const instance = panzoom(element, {
        zoomSpeed: 0.1, // 缩放速度
        maxZoom: 5, // 最大缩放倍数
        minZoom: 0.5 // 最小缩放倍数
      });

      return () => {
        instance.dispose(); // 清除 Panzoom 实例，避免内存泄漏
      };
    }
  }, []);

  // const isDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  // console.log(isDarkMode);

  return (
    <div className="text-black">
      <div ref={svgRef} style={{ overflow: "hidden", width: "100%", height: "600px" }}>
        <div className="h-full w-full">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="end-arrow" viewBox="0 -4 8 8" markerWidth={8} markerHeight={8} orient="auto">
                <path transform="translate(0, 0) rotate(0)" d="M0, -4 L 8 0 L 0 4" fill="#485a74" />
              </marker>
            </defs>

            {edges.map((edge, index) => (
              <path key={index} d={edge} fill="none" stroke="#485a74" strokeWidth={1} markerEnd="url(#end-arrow)" />
            ))}

            {nodes.map(nodeItem => {
              return (
                <g key={nodeItem.id} transform={`translate(${nodeItem.x}, ${nodeItem.y})`}>
                  <rect
                    width={nodeItem.width}
                    height={nodeItem.height}
                    // fill="#2b2c3e"
                    // stroke="#475872"
                    strokeWidth={1}
                    rx={4}
                    ry={4}
                    className="fill-[#F6F8FA] dark:fill-[#2b2c3e]"
                  />
                  <foreignObject width={nodeItem.width} height={nodeItem.height}>
                    <ul
                      className={clsx(
                        "cursor-pointer select-none h-full px-2 text-sm flex flex-col justify-center",
                        "border-[1px] border-[#475872] rounded hover:border-pink-400 duration-500"
                      )}
                    >
                      {nodeItem.content.map((contItem, contIndex) => (
                        <li key={contIndex}>
                          <span className="text-[#761cea] dark:text-[#59b8ff]">
                            {contItem.key}
                            {contItem.key ? ": " : ""}
                          </span>
                          {/* <span style={{ color: contItem.color }}>{contItem.value}</span> */}
                          <span style={{ color: theme === "dark" ? contItem.color.dark : contItem.color.light }}>
                            {contItem.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
