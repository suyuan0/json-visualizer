type JsonValue = { [key: string]: any } | any[];
type ParentPosition = { x: number; y: number; width: number; height: number } | null;
type Content = { key: string; value: string; color: { dark: string; light: string } }[];
type NodeData = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  padding: number;
  content: Content;
};

export function useJsonGraph(value: string) {
  const padding = 8;
  const lineHeight = 20;
  const fontSize = 16;
  const fontFamily = "Roboto";
  const edges: string[] = [];
  const nodes: NodeData[] = [];
  let nodeId = 0;
  let maxX = 0;
  let maxY = 0;
  const occupiedPositions: [x: number, y: number, w: number, h: number][] = [];
  const jsonValue: JsonValue = JSON.parse(value);
  const defaultColor = { dark: "#dce5e7", light: "#6c7a8b" };

  function adjustPosition(x: number, y: number, width: number, height: number): number {
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

  function measureTextWidth(text: string): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    context.font = `${fontSize}px ${fontFamily}`;
    return context.measureText(text).width;
  }

  function calculateValueColor(value: string) {
    const valueTypeColor = {
      string: defaultColor,
      boolean: { dark: "#1abc9c", light: "#00dc7d" },
      number: { dark: "#f1c40f", light: "#e8c479" },
      object: { dark: "#e74c3c", light: "#f5a623" },
      array: { dark: "#e0f7fa", light: "#dce5e7" }
    };

    try {
      const valueType = typeof JSON.parse(value);
      return valueTypeColor[valueType as keyof typeof valueTypeColor];
    } catch {
      return defaultColor;
    }
  }

  function calculateNodeSize(jsonValue: JsonValue): {
    width: number;
    height: number;
    lines: Content;
  } {
    const lines: Content = [];

    if (Array.isArray(jsonValue)) {
      lines.push({ key: "Array", value: "Array", color: defaultColor });
    } else if (typeof jsonValue === "object" && jsonValue !== null) {
      if (Object.keys(jsonValue).length === 0) {
        lines.push({ key: "", value: "{}", color: defaultColor });
      } else {
        for (const [key, value] of Object.entries(jsonValue)) {
          const displayValue = Array.isArray(value)
            ? `Array (${value.length})`
            : typeof value === "object"
              ? "{}"
              : JSON.stringify(value);
          lines.push({ key, value: displayValue, color: calculateValueColor(displayValue) });
        }
      }
    } else {
      lines.push({ key: "", value: JSON.stringify(jsonValue), color: defaultColor });
    }

    const maxWidth = Math.max(...lines.map(line => measureTextWidth(`${line.key}: ${line.value}`), 0));
    const height = lines.length * lineHeight + padding * 2;

    return { width: Math.max(maxWidth + padding * 2, 0), height: Math.max(height, 0), lines };
  }

  function generateNodes(
    jsonValue: JsonValue,
    x: number,
    y: number,
    parentId: string | null = null,
    parentPosition: ParentPosition = null
  ) {
    const { width, height, lines } = calculateNodeSize(jsonValue);
    const adjustedY = adjustPosition(x, y, width, height);
    const currentId = `node-${nodeId++}`;

    nodes.push({
      id: currentId,
      x: x,
      y: adjustedY,
      width: width,
      height: height,
      fontSize: fontSize,
      padding: padding,
      content: lines.map(line => {
        return {
          key: line.key ?? "",
          value: line.value,
          color: line.color
        };
      })
    });

    if (parentId && parentPosition) {
      const parentRightX = parentPosition.x + parentPosition.width - 10;
      const parentCenterY = parentPosition.y + parentPosition.height / 2;
      const childCenterX = x;
      const childCenterY = adjustedY + height / 2;

      const horizontalPadding = 10;

      edges.push(
        `M${parentRightX},${parentCenterY} C ${(parentRightX + childCenterX - horizontalPadding) / 2}, ${parentCenterY} ${(parentRightX + childCenterX - horizontalPadding) / 2}, ${childCenterY} ${childCenterX - 8}, ${childCenterY}`
      );
    }

    let nextYOffset = adjustedY;

    lines.forEach(line => {
      const key = line.key;

      if (key && jsonValue.hasOwnProperty(key)) {
        const value = (jsonValue as { [key: string]: any })[key];

        const childX = x + width + 100;

        if (Array.isArray(value)) {
          const listNode = { [`${line.key} (${value.length})`]: "Array" };
          const listY = nextYOffset;

          generateNodes(listNode, childX, listY, currentId, { x, y: adjustedY, width, height });

          value.forEach((item, index) => {
            const childY = nextYOffset + index * (lineHeight + 30);
            generateNodes(item, childX + calculateNodeSize(listNode).width + 100, childY, `node-${nodeId - 1}`, {
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

          generateNodes(nestedParentNode, childX, nestedParentY, currentId, {
            x,
            y: adjustedY,
            width,
            height
          });

          generateNodes(value, childX + calculateNodeSize(nestedParentNode).width + 100, nestedParentY, `node-${nodeId - 1}`, {
            x: childX,
            y: nestedParentY,
            width: calculateNodeSize(nestedParentNode).width,
            height: calculateNodeSize(nestedParentNode).height
          });

          nextYOffset += calculateNodeSize(value).height + 50;
        }
      } else if (Array.isArray(jsonValue)) {
        const listY = nextYOffset;
        jsonValue.forEach(item => {
          const childX = x + width + 100;

          if (typeof item === "object" && item !== null) {
            generateNodes(item, childX, nextYOffset, currentId, {
              x: x,
              y: listY,
              width: width,
              height: height
            });

            nextYOffset += calculateNodeSize(item).height + 30;
          } else if (Array.isArray(item)) {
            const listNode = { [`(${item.length})`]: "Array" };

            generateNodes(listNode, childX, nextYOffset, currentId, { x, y: adjustedY, width, height });

            item.forEach((subItem, subIndex) => {
              const childY = nextYOffset + subIndex * (lineHeight + 30);

              generateNodes(subItem, childX + calculateNodeSize(listNode).width + 100, childY, `node-${nodeId - 1}`, {
                x: childX,
                y: listY,
                width: calculateNodeSize(listNode).width,
                height: calculateNodeSize(listNode).height
              });
            });

            nextYOffset += item.length * (lineHeight + 30) + 50;
          } else {
            generateNodes(item, childX, nextYOffset, currentId, {
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

  generateNodes(jsonValue, 50, 50);
  return {
    nodes,
    edges,
    maxX,
    maxY
  };
}
