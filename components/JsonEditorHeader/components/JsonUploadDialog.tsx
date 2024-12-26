import { UploadIcon } from "lucide-react";
import { useState } from "react";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import JsonUploader from "./JsonUploader";
import { useTranslation } from "@/app/i18n/client";
import { UploadFileType } from "@/enum";
import { toast } from "@/hooks/use-toast";

interface JsonUploadDialogProps {
  onUpload: (jsonValue: string) => void;
  onJsonFetch: (data: any) => void;
  lng: string;
}

export default function JsonEditorUpload({ onUpload, onJsonFetch, lng }: JsonUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(lng, "editor");

  const handleJsonFile = async (file: File) => {
    try {
      const text = await file.text();
      const jsonValidate = JSON.parse(text);
      onUpload(JSON.stringify(jsonValidate, null, 2));
      setOpen(false);
    } catch {
      toast({
        title: t("header.uploader.toast.jsonParseError.title"),
        description: t("header.uploader.toast.jsonParseError.description"),
        variant: "destructive"
      });
    }
  };

  const handleUpload = async (file: File) => {
    if (file.type === UploadFileType.JSON) {
      handleJsonFile(file);
    }
    // await onUpload(file);
    // setOpen(false);
  };

  const handleJsonFetch = (data: any) => {
    onJsonFetch(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center">
        <UploadTooltip tooltipContent={t("header.tooltip.upload")} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("header.uploader.title")}</DialogTitle>
          <DialogDescription>{t("header.uploader.description")}</DialogDescription>
        </DialogHeader>
        <JsonUploader lng={lng} onUpload={handleUpload} onJsonFetch={handleJsonFetch} />
      </DialogContent>
    </Dialog>
  );
}

function UploadTooltip({ tooltipContent }: { tooltipContent: string }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <UploadIcon className="cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
