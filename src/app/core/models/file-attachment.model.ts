/**
 * File Attachment Model
 * Represents an attached file in a requisition/memo
 */
export interface FileAttachment {
  id: string;
  fileName: string;
  fileSize: number; // Size in bytes
  uploadDate: Date;
  fileType?: string; // MIME type or file extension
  // TODO: Add actual file URL/path when integrating with real API
  fileUrl?: string;
}

