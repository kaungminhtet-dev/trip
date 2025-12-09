import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { RouteSearch } from './route-search';

export function RoutesHeader() {
  return (
    <div className="flex-1 flex sm:flex-row justify-between items-start sm:items-center gap-2">
      <Button asChild>
        <Link href={"routes/new"}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Route
        </Link>
      </Button>
      <RouteSearch placeholder={"Search"} />
    </div>
  );
}
