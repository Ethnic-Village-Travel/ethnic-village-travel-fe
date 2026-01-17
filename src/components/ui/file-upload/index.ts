// Barrel export for file-upload component
export { FileUploadRoot } from './file-upload';
export { FileUploadTrigger } from './file-upload-trigger';
export { FileUploadDropzone } from './file-upload-dropzone';
export {
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  FileUploadClear,
} from './file-upload-item-components';
export { useStore as useFileUpload } from './contexts';
export type * from './types';

// Default export for backward compatibility
export { FileUploadRoot as FileUpload } from './file-upload';

// Short aliases for convenience
export { FileUploadRoot as Root } from './file-upload';
export { FileUploadTrigger as Trigger } from './file-upload-trigger';
export { FileUploadDropzone as Dropzone } from './file-upload-dropzone';
export { FileUploadList as List } from './file-upload-item-components';
export { FileUploadItem as Item } from './file-upload-item-components';
export { FileUploadItemPreview as ItemPreview } from './file-upload-item-components';
export { FileUploadItemMetadata as ItemMetadata } from './file-upload-item-components';
export { FileUploadItemProgress as ItemProgress } from './file-upload-item-components';
export { FileUploadItemDelete as ItemDelete } from './file-upload-item-components';
export { FileUploadClear as Clear } from './file-upload-item-components';
