type Value = { [key: string]: any } | Array<any>;

export default function JsonViewTree(value: Value): string {
  const padding = 10;
  const lineHeight = 18;
  const fontSize = 12;
  const fontFamily = "monospace";
  const svgContent: string[] = [];
  const edges: string[] = [];
  let nodeId = 0;
  let maxX = 0;
  let maxY = 0;
  const occupiedPositions: [x: number, y: number, w: number, h: number][] = [];

  function measureTextWidth(text: string): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    context.font = `${fontSize}px ${fontFamily}`;
    return context.measureText(text).width;
  }

  function calculateNodeSize(obj: Value) {
    const lines: { key: string; value: string }[] = [];

    if (Array.isArray(obj)) {
      lines.push({ key: `(${obj.length})`, value: "Array" });
    } else if (typeof obj === "object" && obj !== null) {
      if (Object.keys(obj).length === 0) {
        lines.push({ key: "", value: "{}" });
      } else {
        for (const [key, value] of Object.entries(obj)) {
          const displayValue = Array.isArray(value)
            ? `Array (${value.length})`
            : typeof value === "object"
              ? "{}"
              : JSON.stringify(value);
          lines.push({ key, value: displayValue });
        }
      }
    } else {
      lines.push({ key: "", value: JSON.stringify(obj) });
    }
    const maxWidth = Math.max(...lines.map(line => measureTextWidth(`${line.key}: ${line.value}`)), 0);
    const height = lines.length * lineHeight + padding * 2;

    return { width: Math.max(maxWidth + padding * 2, 0), height: Math.max(height, 0), lines };
  }

  function adjustPosition(x: number, y: number, width: number, height: number) {
    let adjustedY = y;
    const buffer = 10;

    for (const pos of occupiedPositions) {
      const [ox, oy, ow, oh] = pos;
      if (x < ox + ow && x + width > ox && adjustedY < oy + oh && adjustedY + height > oy) {
        adjustedY = oy + oh + buffer;
      }
    }

    occupiedPositions.push([x, adjustedY, width, height]);
    return adjustedY;
  }

  function buildTree(
    obj: Value,
    x: number,
    y: number,
    parentId: string | null = null,
    parentPosition: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null = null
  ) {
    const { width, height, lines } = calculateNodeSize(obj);
    const adjustedY = adjustPosition(x, y, width, height);
    const currentId = `node-${nodeId++}`;

    const nodeContent = lines
      .map(
        line => `
      <div class="flex">
        <span class="json-key mr-1">${line.key ? `${line.key}:` : ""}</span>
        <span class="json-value">${line.value}</span>
      </div>
    `
      )
      .join("");

    svgContent.push(`
      <g id="${currentId}" transform="translate(${x}, ${adjustedY})">
        <rect width="${width}" height="${height}" rx="5" ry="5" fill="#f6f8fa" stroke="#475872" stroke-width="1"></rect>
        <foreignObject width="${width}" height="${height}">
            <div xmlns="http://www.w3.org/1999/xhtml" class="text-black text-[${fontSize}px] p-[${padding}px]">
                ${nodeContent}
            </div>
        </foreignObject>
      </g>
    `);

    if (parentId && parentPosition) {
      const parentRightX = parentPosition.x + parentPosition.width - 10;
      const parentCenterY = parentPosition.y + parentPosition.height / 2;
      const childCenterX = x;
      const childCenterY = adjustedY + height / 2;

      const horizontalPadding = 10;

      edges.push(
        `<path d="M${parentRightX},${parentCenterY} C ${(parentRightX + childCenterX - horizontalPadding) / 2}, ${parentCenterY} ${(parentRightX + childCenterX - horizontalPadding) / 2}, ${childCenterY} ${childCenterX}, ${childCenterY}" fill="none" stroke="#475872" stroke-width="1" marker-end="url(#arrowhead)" />`
      );
    }

    let nextYOffset = adjustedY;

    lines.forEach(line => {
      const key = line.key;

      if (key && obj.hasOwnProperty(key)) {
        const value = (obj as { [key: string]: any })[key];

        const childX = x + width + 100;

        if (Array.isArray(value)) {
          const listNode = { [`${line.key} (${value.length})`]: "Array" };
          const listY = nextYOffset;

          buildTree(listNode, childX, listY, currentId, { x, y: adjustedY, width, height });

          value.forEach((item, index) => {
            const childY = nextYOffset + index * (lineHeight + 30);
            buildTree(item, childX + calculateNodeSize(listNode).width + 100, childY, `node-${nodeId - 1}`, {
              x: childX,
              y: listY,
              width: calculateNodeSize(listNode).width,
              height: calculateNodeSize(listNode).height
            });
          });

          nextYOffset += value.length * (lineHeight + 30) + 50;
        } else if (typeof value === "object" && value !== null) {
          const nestedParentNode = { [line.key]: "Object" };
          const nestedParentY = nextYOffset;

          buildTree(nestedParentNode, childX, nestedParentY, currentId, {
            x,
            y: adjustedY,
            width,
            height
          });

          buildTree(value, childX + calculateNodeSize(nestedParentNode).width + 100, nestedParentY, `node-${nodeId - 1}`, {
            x: childX,
            y: nestedParentY,
            width: calculateNodeSize(nestedParentNode).width,
            height: calculateNodeSize(nestedParentNode).height
          });

          nextYOffset += calculateNodeSize(value).height + 50;
        }
      } else if (Array.isArray(obj)) {
        const listY = nextYOffset;
        obj.forEach(item => {
          const childX = x + width + 100;

          if (typeof item === "object" && item !== null) {
            buildTree(item, childX, nextYOffset, currentId, {
              x: x,
              y: listY,
              width: width,
              height: height
            });

            nextYOffset += calculateNodeSize(item).height + 30;
          } else if (Array.isArray(item)) {
            const listNode = { [`(${item.length})`]: "Array" };

            buildTree(listNode, childX, nextYOffset, currentId, { x, y: adjustedY, width, height });

            item.forEach((subItem, subIndex) => {
              const childY = nextYOffset + subIndex * (lineHeight + 30);
              buildTree(subItem, childX + calculateNodeSize(listNode).width + 100, childY, `node-${nodeId - 1}`, {
                x: childX,
                y: listY,
                width: calculateNodeSize(listNode).width,
                height: calculateNodeSize(listNode).height
              });
            });

            nextYOffset += item.length * (lineHeight + 30) + 50;
          } else {
            buildTree(item, childX, nextYOffset, currentId, {
              x: x,
              y: listY,
              width: width,
              height: height
            });

            nextYOffset += calculateNodeSize(item).height + 30;
          }
        });
      }
    });

    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, nextYOffset);
  }

  buildTree(value, 50, 50);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${maxX + 150}" height="${maxY + 150}">
        ${edges.join("")}
        ${svgContent.join("")}
  </svg>`;
}
