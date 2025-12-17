'use server';

export type TicketStatus = 'AVAILABLE' | 'SOLD' | 'EXPIRED';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  metaData?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCounts: number;
  totalPages: number;
}

export interface IQuery {
  order_by: string;
  sort_by: string;
  page: string;
  size: string;
  departure?: Date;
  search?: string;
}

export interface IRoute {
  id: string;
  departure: Date;
  arrival: Date;
  origin: string;
  destination: string;
  duration: number;
  transportType: string;
}

export interface ITicket {
  id: string;
  ticketNumber: string;
  price: number;
  status: TicketStatus;
  route: IRoute;
}

export interface ITicketList {
  id: string;
  ticketNumber: string;
  price: number;
  status: TicketStatus;
  origin: string;
  destination: string;
  departure: Date;
}

export interface ICity {
  id: string;
  name: string;
}
