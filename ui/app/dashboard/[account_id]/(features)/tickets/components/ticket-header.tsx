'use client';

import {
  TicketSearch,
} from '@/app/dashboard/[account_id]/(features)/tickets/components/ticket-search';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function TicketHeader() {
  return (
    <div className="flex-1 flex sm:flex-row justify-between items-start sm:items-center gap-2">
      <TicketSearch placeholder={"Search tickets"} />
      <Button asChild>
        <Link href={"tickets/new"}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Ticket
        </Link>
      </Button>
    </div>
  );
}
