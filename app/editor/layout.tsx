import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON visualizer - editor",
  description: "json visualizer editor, edit your json data here and visualize it in real time"
};

export default function EditorLayout(props: BaseProps) {
  return props.children;
}
