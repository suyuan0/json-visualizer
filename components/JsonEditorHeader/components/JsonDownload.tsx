import { DownloadIcon } from "lucide-react";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useTranslation } from "@/app/i18n/client";

interface JsonDownloadProps {
  lng: string;
  jsonValue: string;
}

export default function JsonDownload({ lng, jsonValue }: JsonDownloadProps) {
  const { t } = useTranslation(lng, "editor");

  const handleDownload = () => {
    const blob = new Blob([jsonValue], { type: "application/json" });
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
