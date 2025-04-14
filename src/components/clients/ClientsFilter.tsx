
import { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface ClientsFilterProps {
  onFilterChange: (search: string, status: string | null, sortBy: string, sortOrder: string) => void;
}

const ClientsFilter = ({ onFilterChange }: ClientsFilterProps) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('registration_date');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    onFilterChange(newSearch, status, sortBy, sortOrder);
  };

  const handleStatusChange = (value: string) => {
    const newStatus = value === 'all' ? null : value;
    setStatus(newStatus);
    onFilterChange(search, newStatus, sortBy, sortOrder);
  };

  const handleSortChange = (by: string, order: string) => {
    setSortBy(by);
    setSortOrder(order);
    onFilterChange(search, status, by, order);
  };

  return (
    <div className="mb-5 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="חפש לפי שם, טלפון או אימייל"
          className="pl-10"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={status || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="סטטוס לקוח" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">כל הסטטוסים</SelectItem>
              <SelectItem value="active">פעיל</SelectItem>
              <SelectItem value="lead">ליד</SelectItem>
              <SelectItem value="inactive">לא פעיל</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <ArrowUpDown className="h-4 w-4" />
              <span>מיון</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSortChange('full_name', 'asc')}>
              שם (א-ת)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('full_name', 'desc')}>
              שם (ת-א)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('registration_date', 'desc')}>
              תאריך הצטרפות (חדש לישן)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange('registration_date', 'asc')}>
              תאריך הצטרפות (ישן לחדש)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ClientsFilter;
