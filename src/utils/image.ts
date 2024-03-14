import {
  ErrorMessage,
  FileLoadError,
  FileLoadErrorEnum,
  FileUploadMeta,
  FileUploadStatus,
} from "@/types/upload";

export const MISSING_IMAGE = "/foot.png";
export async function generateDataURL(
  file: File,
  maxSize: number | undefined = 100,
  mimeType: string | undefined = "image/png",
  filterFn?: (ctx: CanvasRenderingContext2D) => void
) {
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(MISSING_IMAGE);
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onerror = () => resolve(MISSING_IMAGE);
      image.onload = () => {
        // Resize the image
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(MISSING_IMAGE);
        ctx.drawImage(image, 0, 0, width, height);
        if (filterFn) filterFn(ctx);
        const dataUrl = canvas.toDataURL(mimeType);
        return resolve(dataUrl);
      };
      const originalImageDataUrl = readerEvent.target?.result as string;
      if (!originalImageDataUrl.startsWith("data:image/"))
        return resolve(MISSING_IMAGE);

      image.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
  return dataUrl;
}

export async function validateFile(meta: FileUploadMeta) {
  let error: FileLoadErrorEnum | null = null;
  const setError = () => {
    if (!error) return true;
    const invmap = Object.fromEntries(
      Object.entries(FileLoadError).map((kv) => kv.reverse())
    ) as Record<FileLoadErrorEnum, keyof typeof FileLoadError>;
    meta.message = ErrorMessage[invmap[error]];
    meta.status = FileUploadStatus.FAILED;
    return false;
  };

  // Check file size <= 5 MB
  const allowedMaxSize = 5 * 1024 * 1024;
  if (meta.file.size > allowedMaxSize) error = FileLoadError.TOOBIG;
  if (error) return setError();

  // Check file mime type
  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedMimeTypes.includes(meta.file.type))
    error = FileLoadError.UNSUPPORTED;

  // Check file header magic number
  const magic: Record<string, Array<number>> = {
    "image/png": [0x89, 0x50, 0x4e, 0x47],
    "image/jpeg": [0xff, 0xd8],
    "image/jpg": [0xff, 0xd8],
  };
  error = await new Promise<FileLoadErrorEnum | null>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (!e.target?.result) return resolve(FileLoadError.INACCESSIBLE);

      const bytes = new Uint8Array(e.target.result as ArrayBufferLike);
      for (const filetype in magic) {
        const sliced = bytes.slice(0, magic[filetype].length);
        const matchedLength = magic[filetype].length == sliced.length;
        const matchedBytes = sliced.every((v, i) => v == magic[filetype][i]);
        if (matchedLength && matchedBytes) return resolve(null);
      }

      return resolve(FileLoadError.UNSUPPORTED);
    };
    reader.readAsArrayBuffer(meta.file.slice(0, 4));
  });
  if (error) return setError();

  // No error
  meta.status = FileUploadStatus.WAITING;
  return true;
}
