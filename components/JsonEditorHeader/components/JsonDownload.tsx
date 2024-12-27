import { DownloadIcon } from "lucide-react";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useTranslation } from "@/app/i18n/client";
import { useJson } from "@/store/useJson";

interface JsonDownloadProps {
  lng: string;
}

export default function JsonDownload({ lng }: JsonDownloadProps) {
  const { t } = useTranslation(lng, "editor");
  const { content } = useJson();

  const handleDownload = () => {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DownloadIcon className="cursor-pointer" onClick={handleDownload} />
        </TooltipTrigger>
        <TooltipContent>{t("header.download")}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
