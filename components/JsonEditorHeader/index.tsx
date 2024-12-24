import JsonUploadDialog from "./components/JsonUploadDialog";
import { uploadFile } from "@/actions/uploadJson";

interface JsonEditorHeaderProps {
  setJsonValue: (value: any) => void;
}

export default function JsonEditorHeader({ setJsonValue }: JsonEditorHeaderProps) {
  async function handleUpload(file: File) {
    console.log(uploadFile, file);

    // const formData = new FormData();
    // formData.append("file", file);
    // const result = await uploadFile(formData);
    // if (result.success) {
    //   console.log("File uploaded successfully:", result.url);
    //   setUploadedFile(result.url);
    // } else {
    //   console.error("File upload failed:", result.error);
    // }
  }

  function handleJsonFetch(data: any) {
    // setJsonData(data)
    console.log("Fetched JSON data:", data);
    setJsonValue(JSON.stringify(data, null, 2));
  }

  return (
    <header className="h-10 bg-[#f9f9f9] dark:bg-[#1e1e2e] border-b-[1px] border-[#cccccc] dark:border-[#44475a] px-4 flex items-center">
      <JsonUploadDialog onUpload={handleUpload} onJsonFetch={handleJsonFetch} />
    </header>
  );
}
