
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ClientsAdvancedFilterProps {
  onFilterChange: (filters: ClientFilters) => void;
  className?: string;
}

export interface ClientFilters {
  search: string;
  status: string | null;
  treatmentType: string | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  sortBy: string;
  sortOrder: string;
}

const treatmentTypes = [
  'לק ג\'ל',
  'בניית ציפורניים', 
  'פדיקור',
  'טיפוח עור',
  'עיצוב ציפורניים'
];

const ClientsAdvancedFilter = ({ onFilterChange, className }: ClientsAdvancedFilterProps) => {
  const [filters, setFilters] = useState<ClientFilters>({
    search: '',
    status: null,
    treatmentType: null,
    dateFrom: null,
    dateTo: null,
    sortBy: 'registration_date',
    sortOrder: 'desc'
  });

  const updateFilters = (newFilters: Partial<ClientFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const clearedFilters: ClientFilters = {
      search: '',
      status: null,
      treatmentType: null,
      dateFrom: null,
      dateTo: null,
      sortBy: 'registration_date',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <Card className={cn("shadow-soft", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="size-5 text-primary" />
          סינון מתקדם
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">חיפוש כללי</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                id="search"
                placeholder="שם, טלפון או מייל..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pr-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>סטטוס לקוחה</Label>
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => updateFilters({ status: value === 'all' ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="כל הסטטוסים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="active">פעילה</SelectItem>
                <SelectItem value="inactive">לא פעילה</SelectItem>
                <SelectItem value="lead">ליד</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Treatment Type Filter */}
          <div className="space-y-2">
            <Label>סוג טיפול מועדף</Label>
            <Select 
              value={filters.treatmentType || 'all'} 
              onValueChange={(value) => updateFilters({ treatmentType: value === 'all' ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="כל הטיפולים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הטיפולים</SelectItem>
                {treatmentTypes.map((treatment) => (
                  <SelectItem key={treatment} value={treatment}>
                    {treatment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label>תאריך הצטרפות מ-</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-right font-normal",
                    !filters.dateFrom && "text-muted-foreground"
                  )}
                >
                  {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy") : "בחר תאריך"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => updateFilters({ dateFrom: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label>תאריך הצטרפות עד</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-right font-normal",
                    !filters.dateTo && "text-muted-foreground"
                  )}
                >
                  {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy") : "בחר תאריך"}
                  <CalendarIcon className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => updateFilters({ dateTo: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <Label>מיון לפי</Label>
            <div className="flex gap-2">
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => updateFilters({ sortBy: value })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="registration_date">תאריך הצטרפות</SelectItem>
                  <SelectItem value="full_name">שם</SelectItem>
                  <SelectItem value="visit_count">מספר ביקורים</SelectItem>
                  <SelectItem value="status">סטטוס</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.sortOrder} 
                onValueChange={(value) => updateFilters({ sortOrder: value })}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">עולה</SelectItem>
                  <SelectItem value="desc">יורד</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-start pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="size-4" />
            נקה סינונים
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsAdvancedFilter;
