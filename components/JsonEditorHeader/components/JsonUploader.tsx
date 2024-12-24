import { LinkIcon, FolderUpIcon, LoaderIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

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
}

export default function JsonUploader({ onUpload, onJsonFetch }: JsonUploaderProps) {
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (fileOrUrl: File) => {
      setIsUploading(true);
      setError(null);

      try {
        await onUpload(fileOrUrl);
      } catch (error) {
        console.error("Upload failed:", error);
        setError("Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload]
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
      setError("Please enter a valid URL");
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
      setError("Failed to fetch JSON data. Please check the URL and try again.");
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
            placeholder="Enter URL for JSON data"
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
        <input {...getInputProps()} />

        {isUploading ? (
          <LoaderIcon className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
        ) : (
          <FolderUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        )}
        <p className="mt-2 text-sm text-gray-600">Drag & drop a file here, or click to select a JSON file</p>
      </div>
    </div>
  );
}
