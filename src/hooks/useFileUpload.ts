import { useState } from 'react';
import type { ArchiveItem } from '../types/archive.types';
import { archiveApi } from '../services/archiveApi';
import { validateFileSize, validateFileType, type ValidationMessages } from '../utils/validation';

interface UploadFileData {
  file: File;
  topic: string;
  subCategory: string;
  description: string;
}

interface UseFileUploadReturn {
  uploadFile: (data: UploadFileData) => Promise<void>;
  isUploading: boolean;
  error: string | null;
  success: boolean;
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/*',
  'video/*'
];

export function useFileUpload(
  onSuccess?: (item: ArchiveItem) => void, 
  userId?: string | null,
  validationMessages?: ValidationMessages
): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const uploadFile = async (data: UploadFileData): Promise<void> => {
    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const sizeValidation = validateFileSize(data.file.size, 10, validationMessages);
      if (!sizeValidation.isValid) {
        throw new Error(sizeValidation.message);
      }

      const typeValidation = validateFileType(data.file.type, ALLOWED_FILE_TYPES);
      if (!typeValidation.isValid) {
        throw new Error(typeValidation.message);
      }

      const fileUrl = await createFileUrl(data.file);
      const fileContent = await readFileAsText(data.file);

      const newItemId = await archiveApi.createArchiveItem({
        topic: data.topic,
        subCategory: data.subCategory,
        featuredFile: data.file.name,
        fileUrl: fileUrl,
        fileType: data.file.type,
        fileContent: fileContent,
        ownerId: userId || 'guest'
      });

      const newItem: ArchiveItem = {
        id: newItemId,
        topic: data.topic,
        subCategory: data.subCategory,
        featuredFile: data.file.name,
        fileUrl: fileUrl,
        fileType: data.file.type,
        fileContent: fileContent,
        ownerId: userId || 'guest'
      };

      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(newItem);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error, success };
}

export async function getSavedArchiveItems(): Promise<ArchiveItem[]> {
  return await archiveApi.getAllArchiveItems();
}

async function createFileUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}

async function readFileAsText(file: File): Promise<string | undefined> {
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsText(file);
    });
  }
  return undefined;
}
