type NodeType = "object" | "array" | "property" | "string" | "number" | "boolean" | "null";

interface NodeData {
  id: string;
  text: string | [string, string][];
  width: number;
  height: number;
  path?: string;
  data: {
    type: NodeType;
    isParent: boolean;
    isEmpty: boolean;
    childrenCount: number;
  };
}

interface EdgeData {
  id: string;
  from: string;
  to: string;
}

type LayoutDirection = "LEFT" | "RIGHT" | "DOWN" | "UP";
