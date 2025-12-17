import {
  getCities,
} from '@/app/dashboard/[account_id]/(features)/routes/lib/mock-api';
import {
  TicketFilter,
} from '@/app/dashboard/[account_id]/(features)/tickets/components/ticket-filter';
import {
  TicketsList,
} from '@/app/dashboard/[account_id]/(features)/tickets/components/tickets-list';
import {
  IQuery,
} from '@/app/dashboard/[account_id]/(features)/tickets/lib/types';
import withDashboardHeader
  from '@/app/dashboard/[account_id]/components/dashboard-header';
import { Suspense } from 'react';
import { TicketHeader } from './components/ticket-header';
import { TicketsTableSkeleton } from './components/tickets-table-skeleton';

export default async function TicketsPage(props: {
  searchParams: Promise<IQuery>;
}) {
  const query = await props.searchParams;
  const cities = await getCities();
  const Header = withDashboardHeader(TicketHeader);

  return (
    <main className="flex flex-col gap-2 container h-screen overflow-hidden">
      <Header />
      <div className={"px-1"}>
        <TicketFilter cities={cities} />
      </div>
      <Suspense fallback={<TicketsTableSkeleton />}>
          <TicketsList query={query} />
      </Suspense>
    </main>
  );
}
