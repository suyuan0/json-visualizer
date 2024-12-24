import { UploadIcon } from "lucide-react";
import { useState } from "react";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import JsonUploader from "./JsonUploader";

interface JsonUploadDialogProps {
  onUpload: (file: File) => Promise<void>;
  onJsonFetch: (data: any) => void;
}

export default function JsonEditorUpload({ onUpload, onJsonFetch }: JsonUploadDialogProps) {
  const [open, setOpen] = useState(false);

  const handleUpload = async (file: File) => {
    await onUpload(file);
    setOpen(false);
  };

  const handleJsonFetch = (data: any) => {
    onJsonFetch(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center">
        <UploadTooltip />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File or Fetch JSON</DialogTitle>
          <DialogDescription> Upload a file from your device or fetch JSON data from a URL.</DialogDescription>
        </DialogHeader>
        <JsonUploader onUpload={handleUpload} onJsonFetch={handleJsonFetch} />
      </DialogContent>
    </Dialog>
  );
}

function UploadTooltip() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <UploadIcon className="cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>Upload</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
