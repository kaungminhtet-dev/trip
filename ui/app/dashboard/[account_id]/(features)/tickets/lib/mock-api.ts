'use server';

import {
  IQuery,
  IRoute,
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

const routedb: IRoute[] = Array(100).fill(1).map((i) => ({
  id: faker.string.uuid(),
  origin: faker.location.city(),
  arrival: faker.date.soon(),
  departure: faker.date.soon(),
  duration: faker.number.int({min: 1, max: 10}),
  transportType: faker.helpers.arrayElement(['bus', 'train', 'plane']),
  destination: faker.location.city(),
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

export async function fetchRoute(date: Date) :Promise<ApiResponse<IRoute[]>> {
  return {
    success: true,
    message: "Routes are successfully fetched",
    data: routedb.slice(0, 10),
    metaData: null,
  }
}