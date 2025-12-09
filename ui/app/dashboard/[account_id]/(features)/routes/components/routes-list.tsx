import {
  IQuery,
} from '@/app/dashboard/[account_id]/(features)/routes/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchRouteList } from '../lib/mock-api';
import { AppPagination } from './pagination';
import { RoutesTable } from './routes-table';

interface RoutesListProps {
  query: IQuery
}

export async function RoutesList({ query }: RoutesListProps) {
  const routes = await fetchRouteList(query);
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
    <div className={"flex-1 flex flex-col pb-1 justify-between" +
      " overflow-hidden"}>
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
