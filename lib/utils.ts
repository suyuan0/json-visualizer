import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileFormat } from "@/enum/file.enum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const contentToJson = async (value: string, format = FileFormat.JSON): Promise<object> => {
  try {
    // const {} = await import("js-yaml")

    const { parse } = await import("jsonc-parser");

    let json: object = {};

    if (format === FileFormat.JSON) json = parse(value);

    if (!json) throw Error("Invalid JSON!");
    return Promise.resolve(json);
  } catch (error: any) {
    throw error;
  }
};

export const jsonToContent = async (json: string, format: FileFormat): Promise<string> => {
  try {
    // const { dump } = await import("js-yaml");
    // const { json2csv } = await import("json-2-csv");
    const { parse } = await import("jsonc-parser");

    let contents = json;

    if (!json) return json;
    if (format === FileFormat.JSON) contents = json;
    // if (format === FileFormat.YAML) contents = dump(parse(json));
    // if (format === FileFormat.XML) contents = dump(parse(json));
    // if (format === FileFormat.TOML) contents = dump(parse(json));
    // if (format === FileFormat.CSV) contents = await json2csv(parse(json));

    return Promise.resolve(contents);
  } catch (error: any) {
    throw error;
  }
};
