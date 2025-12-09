'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
  placeholder: string;
}

export function RouteSearch({ placeholder }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  const handleSelectTransportType = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (value === 'ALL') {
      params.delete('transport_type');
    } else {
      params.set('transport_type', value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex-1 flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search
          className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder={placeholder}
               defaultValue={searchParams.get('query')?.toString()}
               onChange={(e) => handleSearch(e.target.value)}
               className="pl-8" />
      </div>
      <Select onValueChange={handleSelectTransportType}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Transport Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="bus">Bus</SelectItem>
          <SelectItem value="train">Train</SelectItem>
          <SelectItem value="flight">Flight</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
