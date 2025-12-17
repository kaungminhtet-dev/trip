import { z } from 'zod';

export enum TicketStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export const createTicketSchema = z.object({
  ticketNumber: z
    .string()
    .min(1, "Ticket number is required")
    .regex(/^TK-\d{3,}$/, "Ticket number must be in format TK-XXX"),
  price: z.number().gt(0, "Invalid price"),
  routeId: z.uuidv4("Invalid route"),
  status: z.enum(TicketStatus),
  bookingId: z.uuidv4().optional(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
