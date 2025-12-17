'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
  placeholder: string;
}

export function TicketSearch({ placeholder }: Props) {
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

  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder={placeholder}
             defaultValue={searchParams.get('query')?.toString()}
             onChange={(e) => handleSearch(e.target.value)}
             className="pl-8" />
    </div>
  );
}
