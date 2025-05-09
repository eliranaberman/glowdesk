
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface CustomerSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const CustomerSearch = ({ onSearch, initialValue = '' }: CustomerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="חיפוש לפי שם, טלפון או אימייל..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-10 py-2 text-right w-full"
      />
    </div>
  );
};

export default CustomerSearch;
