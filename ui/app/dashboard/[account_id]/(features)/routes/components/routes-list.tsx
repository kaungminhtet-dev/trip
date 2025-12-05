import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchRouteList } from '../lib/mock-api';
import { AppPagination } from './pagination';
import { RoutesTable } from './routes-table';

interface RoutesListProps {
  query?: string;
  currentPage?: number;
}

export async function RoutesList({ query, currentPage }: RoutesListProps) {
  const routes = await fetchRouteList({
    limit: 10,
    page: currentPage || 1,
    search: query,
    order_by: "departure",
    sort_by: "asc",
  });
  const totalPages = routes.metaData?.totalPages as number;

  if (!(routes.success && routes.data != null)) {
    return (
      <div className="">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          No routes found.
        </h4>
      </div>
    );
  }

  return (
    <div className={"h-11/12 flex flex-col gap-3 overflow-hidden"}>
      <ScrollArea className="h-11/12 w-full rounded-md border p-1">
        <RoutesTable routes={routes.data} />
      </ScrollArea>
      <AppPagination
        totalPages={totalPages}
        maxVisiblePages={totalPages >= 10 ? 10 : totalPages}
      />
    </div>
  )
}
