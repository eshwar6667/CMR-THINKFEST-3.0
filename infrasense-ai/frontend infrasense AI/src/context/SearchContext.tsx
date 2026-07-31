import React, { createContext, useContext, useState } from 'react';

interface FiltersType {
  severity: string;
  category: string;
  status: string;
  district: string;
  priority: string;
  assetType: string;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FiltersType;
  updateFilters: (newFilters: Partial<FiltersType>) => void;
  resetFilters: () => void;
}

const defaultFilters: FiltersType = {
  severity: 'All',
  category: 'All',
  status: 'All',
  district: 'All',
  priority: 'All',
  assetType: 'All',
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FiltersType>(defaultFilters);

  const updateFilters = (newFilters: Partial<FiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSearchQuery('');
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filters,
        updateFilters,
        resetFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
