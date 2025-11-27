export interface ArchiveItem {
  id: number;
  topic: string;
  subCategory: string;
  featuredFile: string;
  fileUrl?: string;
  fileType?: string;
  fileContent?: string;
  ownerId: string;
}
