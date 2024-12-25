import { Metadata } from "next";
import { translation } from "@/app/i18n";

export async function generateMetadata({ params }: ServerParams): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await translation(lng, "editor");

  return {
    title: t("metadata.title"),
    description: t("metadata.description")
  };
}

export default async function EditorLayout(props: BaseProps) {
  return props.children;
}
