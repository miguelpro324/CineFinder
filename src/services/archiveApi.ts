import type { ArchiveItem } from '../types/archive.types';

// API base URL - Dynamically use current host or environment variable
const getApiBaseUrl = () => {
  // If VITE_API_BASE_URL is set and not localhost, use it
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  
  // Otherwise, use the current window location host with port 5000
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:5000/api`;
};

const API_BASE_URL = getApiBaseUrl();

interface CreateArchiveItemData {
  topic: string;
  subCategory: string;
  featuredFile: string;
  fileType?: string;
  fileContent?: string;
  ownerId: string;
  fileUrl?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  id?: number;
  message?: string;
  error?: string;
}

export const archiveApi = {
  async createArchiveItem(data: CreateArchiveItemData): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/archive-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create archive item');
    }

    const result: ApiResponse<never> = await response.json();
    return result.id || 0;
  },

  async getAllArchiveItems(): Promise<ArchiveItem[]> {
    const response = await fetch(`${API_BASE_URL}/archive-items`);

    if (!response.ok) {
      throw new Error('Failed to fetch archive items');
    }

    const result: ApiResponse<ArchiveItem[]> = await response.json();
    return result.data || [];
  },

  async getArchiveItemById(id: number): Promise<ArchiveItem | null> {
    const response = await fetch(`${API_BASE_URL}/archive-items/${id}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch archive item');
    }

    const result: ApiResponse<ArchiveItem> = await response.json();
    return result.data || null;
  },

  async getArchiveItemFile(id: number): Promise<string | null> {
    const response = await fetch(`${API_BASE_URL}/archive-items/${id}/file`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch archive file');
    }

    const result: ApiResponse<{ fileUrl: string }> = await response.json();
    return result.data?.fileUrl || null;
  },

  async updateArchiveItem(id: number, data: Partial<ArchiveItem>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/archive-items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update archive item');
    }
  },

  async deleteArchiveItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/archive-items/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete archive item');
    }
  },
};
