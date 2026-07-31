import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-darkbg-border bg-white dark:bg-darkbg-card py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 transition-colors duration-200">
      <p>© {new Date().getFullYear()} Municipal Corporation Smart City Portal. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          AI Engines Live (v2.4)
        </span>
        <span className="hidden sm:inline">|</span>
        <button className="hover:underline">Platform API Terms</button>
        <button className="hover:underline">Contact Support</button>
      </div>
    </footer>
  );
};
