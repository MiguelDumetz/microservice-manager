import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 lg:pl-9 pr-3 py-1.5 text-xs lg:text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-slate-300 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-gray-400 dark:focus:border-slate-500 transition-colors"
      />
    </div>
  );
}

export default SearchBar;
