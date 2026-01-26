import { join } from "path";

export namespace UploadService {
  const UPLOAD_DIR = "public/uploads";

  export const uploadFile = async (file: File): Promise<string> => {
    const extension = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = join(UPLOAD_DIR, fileName);

    await Bun.write(filePath, file);

    // Return the relative URL to be stored in DB
    return `/public/uploads/${fileName}`;
  };

  export const uploadMultiple = async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map(file => uploadFile(file)));
  };
}
