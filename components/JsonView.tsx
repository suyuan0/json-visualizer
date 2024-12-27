import { useEffect, useRef, useState } from "react";
import panzoom, { PanZoom } from "panzoom";
import clsx from "clsx";

import { useJsonGraph } from "@/hooks/useJsonGraph";
import useTheme from "@/hooks/useTheme";
import { useJson } from "@/store/useJson";

export default function JsonView() {
  const svgRef = useRef<HTMLDivElement>(null);

  const { content } = useJson();
  const { nodes, edges, maxX, maxY } = useJsonGraph(content);
  const { theme } = useTheme();
  const [panzoomInstance, setPanzoomInstance] = useState<PanZoom | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      const element = svgRef.current;
      const instance = panzoom(element, {
        zoomSpeed: 0.1
      });
      setPanzoomInstance(instance);
      return () => {
        instance.dispose();
        setPanzoomInstance(null);
      };
    }
  }, []);

  useEffect(() => {
    if (panzoomInstance) {
      panzoomInstance.moveTo(0, 0);
      panzoomInstance.zoomAbs(0, 0, 1);
    }
  }, [content, panzoomInstance]);

  return (
    <div className="text-black">
      <div ref={svgRef}>
        <svg
          width={maxX + 150}
          height={maxY + 150}
          viewBox={`0 0 ${maxX + 150} ${maxY + 150}`}
          xmlns="http://www.w3.org/2000/svg"
        >
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
  );
}
