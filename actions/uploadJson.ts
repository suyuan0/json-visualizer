"use server";

// import { put } from "@vercel/blob";

export async function uploadFile(data: FormData) {
  console.log(data);

  // const file = data.get("file") as File;
  // if (!file) {
  //   throw new Error("No file uploaded");
  // }

  // try {
  //   const blob = await put(file.name, file, { access: "public" });
  //   return { success: true, url: blob.url };
  // } catch (error) {
  //   console.error("Upload error:", error);
  //   return { success: false, error: "Upload failed" };
  // }
}
