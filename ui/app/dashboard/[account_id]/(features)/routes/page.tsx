import {
  RoutesList,
} from '@/app/dashboard/[account_id]/(features)/routes/components/routes-list';
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
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const Header = withDashboardHeader(RoutesHeader);

  return (
    <main className="px-1 container h-screen overflow-hidden">
      <Header />
      <Suspense fallback={<RoutesTableSkeleton />}>
          <RoutesList query={query} currentPage={currentPage} />
      </Suspense>
    </main>
  );
}
