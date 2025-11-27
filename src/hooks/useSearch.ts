import { useState, useCallback } from 'react';
import type { ArchiveItem } from '../types/archive.types';
import { getSavedArchiveItems } from './useFileUpload';

interface UseSearchReturn {
  searchQuery: string;
  startDate: string;
  endDate: string;
  searchResults: ArchiveItem[];
  hasSearched: boolean;
  setSearchQuery: (query: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  handleSearch: () => void;
  handleClear: () => void;
}

export function useSearch(): UseSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchResults, setSearchResults] = useState<ArchiveItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    setHasSearched(true);

    const allItems = await getSavedArchiveItems();
    
    const results = allItems.filter((item: ArchiveItem) => {
      const matchesQuery = searchQuery.trim() === '' || 
        item.featuredFile.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(searchQuery.toLowerCase());

      const itemDate = new Date(item.id);
      const matchesStartDate = startDate === '' || itemDate >= new Date(startDate);
      const matchesEndDate = endDate === '' || itemDate <= new Date(endDate);

      return matchesQuery && matchesStartDate && matchesEndDate;
    });

    setSearchResults(results);
  }, [searchQuery, startDate, endDate]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setSearchResults([]);
    setHasSearched(false);
  }, []);

  return {
    searchQuery,
    startDate,
    endDate,
    searchResults,
    hasSearched,
    setSearchQuery,
    setStartDate,
    setEndDate,
    handleSearch,
    handleClear
  };
}
