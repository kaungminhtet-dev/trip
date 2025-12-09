import {
  RouteFilter,
} from '@/app/dashboard/[account_id]/(features)/routes/components/route-filter';
import {
  RoutesList,
} from '@/app/dashboard/[account_id]/(features)/routes/components/routes-list';
import {
  getCities,
  getOperators,
} from '@/app/dashboard/[account_id]/(features)/routes/lib/mock-api';
import {
  IQuery,
} from '@/app/dashboard/[account_id]/(features)/routes/lib/types';
import withDashboardHeader
  from '@/app/dashboard/[account_id]/components/dashboard-header';
import { Suspense } from 'react';
import { RoutesHeader } from './components/routes-header';
import { RoutesTableSkeleton } from './components/routes-table-skeleton';

export default async function RoutesPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const query = await props.searchParams as IQuery;
  const Header = withDashboardHeader(RoutesHeader);
  const operators = await getOperators();
  const cities = await getCities();

  return (
    <main className="flex flex-col gap-2 px-1 container min-h-screen overflow-hidden">
      <Header />
      <RouteFilter
        operators={operators}
        cities={cities}
      />
      <Suspense fallback={<RoutesTableSkeleton />}>
          <RoutesList query={query} />
      </Suspense>
    </main>
  );
}
