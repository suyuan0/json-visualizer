import { LinkIcon, FolderUpIcon, LoaderIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useTranslation } from "@/app/i18n/client";
import { UploadFileType } from "@/enum";
import { toast } from "@/hooks/use-toast";
import { maxFileSize } from "@/config";

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

interface JsonUploaderProps {
  onUpload: (file: File) => Promise<void>;
  onJsonFetch: (data: any) => void;
  lng: string;
}

const fileTypes: UploadFileType[] = [UploadFileType.JSON];

export default function JsonUploader({ onUpload, onJsonFetch, lng }: JsonUploaderProps) {
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation(lng, "editor");

  const handleUpload = useCallback(
    async (file: File) => {
      if (!(fileTypes as string[]).includes(file.type)) {
        toast({
          title: t("header.uploader.toast.uploadError.title"),
          description: t("header.uploader.toast.uploadError.description"),
          variant: "destructive"
        });
        return;
      }

      if (file.size > maxFileSize) {
        toast({
          title: t("header.uploader.toast.fileTooLarge.title"),
          description: t("header.uploader.toast.fileTooLarge.description"),
          variant: "destructive"
        });
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        await onUpload(file);
      } catch (error) {
        console.error("Upload failed:", error);
        setError(t("header.uploader.error.1"));
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, t]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleUpload(acceptedFiles[0]);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFetchJson = async () => {
    if (!isValidUrl(url)) {
      setError(t("header.uploader.error.2"));
      return;
    }
    setIsFetching(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      onJsonFetch(data);
    } catch (error) {
      console.error("Fetch failed:", error);
      setError(t("header.uploader.error.3"));
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-x-2">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder={t("header.uploader.placeholder")}
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              setError(null);
            }}
          />
          <Button onClick={handleFetchJson} disabled={!url || isUploading}>
            {isFetching ? <LoaderIcon className="mr-2 h-4 w-4 animate-spin" /> : <LinkIcon className="mr-2 h-4 w-4" />}
            Fetch JSON
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
        )}
      >
        <input {...getInputProps()} accept={fileTypes.join(",")} />

        {isUploading ? (
          <LoaderIcon className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
        ) : (
          <FolderUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        )}
        <p className="mt-2 text-sm text-gray-600">{t("header.uploader.fileUpload")}</p>
        <p className="mt-2 text-sm text-gray-600">{t("header.uploader.tips")}</p>
      </div>
    </div>
  );
}
