import React from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Global Search (Issue ID, Asset, Location, Engineer...)"
        className="block w-full pl-10 pr-10 py-2 border border-slate-200 dark:border-darkbg-border rounded-xl bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-150"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
