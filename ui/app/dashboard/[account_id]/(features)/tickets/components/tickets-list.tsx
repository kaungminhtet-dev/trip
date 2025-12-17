import {
  formatTimeWithAMPM,
} from '@/app/dashboard/[account_id]/(features)/routes/lib/utils';
import {
  TicketPagination,
} from '@/app/dashboard/[account_id]/(features)/tickets/components/ticket-pagination';
import {
  fetchTickets,
} from '@/app/dashboard/[account_id]/(features)/tickets/lib/mock-api';
import {
  IQuery,
} from '@/app/dashboard/[account_id]/(features)/tickets/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Eye, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { TicketStatusBadge } from './ticket-status-badge';

export async function TicketsList({ query }: { query: IQuery }) {
  const response = await fetchTickets(query);
  const totalPages = response.metaData?.totalPages as number;

  return (
    <div
      className="flex-1 pb-1 flex justify-between flex-col gap-1 overflow-hidden">
      <ScrollArea className={"h-11/12 w-full border rounded-md p-1"}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket Number</TableHead>
              <TableHead>From - To</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {response.data?.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell
                  className="font-medium">{ticket.ticketNumber}</TableCell>
                <TableCell>{`${ticket.origin} to ${ticket.destination}`}</TableCell>
                <TableCell>{formatTimeWithAMPM(ticket.departure)}</TableCell>
                <TableCell>${ticket.price}</TableCell>
                <TableCell>
                  <TicketStatusBadge status={ticket.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/abc123/tickets/${ticket.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/abc123/tickets/${ticket.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit ticket
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <TicketPagination
        totalPages={totalPages}
        maxVisiblePages={totalPages >= 10 ? 10 : totalPages}
      />
    </div>
  );
}
