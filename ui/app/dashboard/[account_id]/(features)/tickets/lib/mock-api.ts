'use server';

import {
  IQuery,
  ITicketList,
  TicketStatus,
} from '@/app/dashboard/[account_id]/(features)/tickets/lib/types';
import { ApiResponse } from '@/lib/type';
import { faker } from '@faker-js/faker';

faker.seed(123);

const ticketStatus: TicketStatus[] = ['AVAILABLE', "SOLD", "EXPIRED"] as const;

const ticketsdb: ITicketList[] = Array(100).fill(1).map((i) => ({
  id: faker.string.uuid(),
  price: faker.number.int({min: 10000, max: 50000}),
  ticketNumber: `TK-${i}`,
  status: faker.helpers.arrayElement(ticketStatus),
  origin: faker.location.city(),
  destination: faker.location.city(),
  departure: faker.date.soon(),
}))

function getTickets(query: IQuery):ITicketList[] {
  const start = (Number(query.page) - 1) * Number(query.size)
  const end = start + Number(query.size)
  return ticketsdb.slice(start, end);
}

export async function fetchTickets(query: IQuery) :Promise<ApiResponse<ITicketList[]>> {
  const tickets = getTickets(query);

  return {
    success: true,
    message: "Tickets are successfully fetched",
    data: tickets,
    metaData: {
      size: Number(query.size),
      page: Number(query.page + 1),
      totalCounts: tickets.length,
      totalPages: Math.floor(ticketsdb.length/Number(query.size)),
    }
  }
}