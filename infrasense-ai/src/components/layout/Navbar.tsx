import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { NotificationPanel } from './NotificationPanel';
import { ProfileDropdown } from './ProfileDropdown';
import { Breadcrumb } from './Breadcrumb';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-darkbg-border bg-white/80 dark:bg-darkbg-card/85 backdrop-blur-md transition-colors duration-200">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Mobile menu trigger & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkbg-border md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:block">
            <Breadcrumb />
          </div>
        </div>

        {/* Search Bar - centered or pushed left */}
        <div className="flex-1 max-w-md hidden md:block">
          <SearchBar />
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Light/Dark mode switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkbg-border transition-all duration-150"
            title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>

          <NotificationPanel />

          <div className="h-6 w-px bg-slate-200 dark:bg-darkbg-border mx-1" />

          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
