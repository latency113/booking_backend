import { join } from "path";
import { mkdir } from "node:fs/promises";

export namespace UploadService {
  const UPLOAD_DIR = join(process.cwd(), "public/uploads");

  export const uploadFile = async (file: File): Promise<string> => {
    try {
      // Ensure directory exists
      await mkdir(UPLOAD_DIR, { recursive: true });

      const extension = file.name.split(".").pop() || "png";
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = join(UPLOAD_DIR, fileName);

      const arrayBuffer = await file.arrayBuffer();
      const bytesWritten = await Bun.write(filePath, arrayBuffer);
      
      console.log(`Uploaded: ${fileName}, Bytes: ${bytesWritten}`);

      // Return the relative URL to be served by @elysiajs/static
      // Note: @elysiajs/static by default serves 'public' at root '/'
      // If staticPlugin({ assets: 'public', prefix: '/public' }) is used, adjust here.
      return `/public/uploads/${fileName}`;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  export const uploadMultiple = async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map(file => uploadFile(file)));
  };
}
