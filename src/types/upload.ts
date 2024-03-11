export const UploadStatus = Object.freeze({
  NOFILE: "nofile",
  WAITING: "waiting",
  UPLOADING: "uploading",
  COMPLETE: "complete",
});
export type UploadStatusEnum = (typeof UploadStatus)[keyof typeof UploadStatus];

export interface UploadResponseDetail {
  filename: string;
  success: boolean;
  imgid?: number;
  err?: string;
}
export type UploadResponse = Array<UploadResponseDetail>;

export const FileUploadStatus = Object.freeze({
  VALIDATING: "validating",
  WAITING: "waiting",
  UPLOADING: "uploading",
  SUCCESS: "success",
  FAILED: "failed",
});

export const FileLoadError = Object.freeze({
  TOOBIG: "toobig",
  UNSUPPORTED: "unsupported",
  INACCESSIBLE: "inaccessible",
});
export type FileLoadErrorEnum =
  (typeof FileLoadError)[keyof typeof FileLoadError];
export type FileUploadStatusEnum =
  (typeof FileUploadStatus)[keyof typeof FileUploadStatus];

export const ErrorMessage = Object.freeze({
  TOOBIG: "ERROR: File size is too large.",
  UNSUPPORTED: "ERROR: Unsupported file format.",
  INACCESSIBLE: "ERROR: File cannot be read.",
  UPLOADFAILED: "ERROR: File is not uploaded.",
});

export interface FileUploadMeta {
  file: File;
  preview: string;
  status: FileUploadStatusEnum;
  progress: number;
  message: string;
  id?: number;
}
