"use server";

import { revalidatePath } from 'next/cache';
import { type CreateTicketFormValues, createTicketSchema } from './schema';

const tickets = [
  {
    id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
    ticketNumber: "TK-001",
    price: 12500,
    status: "AVAILABLE",
    createdAt: new Date("2023-04-15T09:30:00"),
    updatedAt: new Date("2023-04-15T09:30:00"),
    routeId: "route-1",
    routeName: "New York to Boston",
  },
  {
    id: "7c8b9e1f-a3d2-4c5b-9e8f-7a1b2c3d4e5f",
    ticketNumber: "TK-002",
    price: 8500,
    status: "SOLD",
    createdAt: new Date("2023-04-16T10:15:00"),
    updatedAt: new Date("2023-04-17T14:20:00"),
    routeId: "route-2",
    routeName: "Chicago to Detroit",
  },
  {
    id: "3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b",
    ticketNumber: "TK-003",
    price: "210.75",
    status: "RESERVED",
    createdAt: new Date("2023-04-18T08:45:00"),
    updatedAt: new Date("2023-04-18T16:30:00"),
    routeId: "route-3",
    routeName: "Los Angeles to San Francisco",
  },
  {
    id: "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
    ticketNumber: "TK-004",
    price: 15000,
    status: "CANCELLED",
    createdAt: new Date("2023-04-19T11:20:00"),
    updatedAt: new Date("2023-04-20T09:10:00"),
    routeId: "route-1",
    routeName: "New York to Boston",
  },
  {
    id: "2a3b4c5d-6e7f-8a9b-0c1d-2e3f4a5b6c7d",
    ticketNumber: "TK-005",
    price: 9500,
    status: "EXPIRED",
    createdAt: new Date("2023-04-10T14:50:00"),
    updatedAt: new Date("2023-04-21T18:05:00"),
    routeId: "route-4",
    routeName: "Seattle to Portland",
  },
];

export async function getRoutes() {
  return [
    { id: "route-1", name: "New York to Boston" },
    { id: "route-2", name: "Chicago to Detroit" },
    { id: "route-3", name: "Los Angeles to San Francisco" },
    { id: "route-4", name: "Seattle to Portland" },
  ];
}

export async function getTicketById(id: string) {
  const ticket = tickets.find((ticket) => ticket.id === id);

  if (!ticket) {
    return null;
  }

  return ticket;
}

export async function getTickets() {
  return tickets;
}

async function saveTicketToDatabase(ticket: CreateTicketFormValues) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newTicket = {
    id: `ticket-${Math.random().toString(36).substring(2, 9)}`,
    ...ticket,
    createdAt: new Date(),
    updatedAt: new Date(),
    routeName:
      (await getRoutes()).find((route) => route.id === ticket.routeId)?.name ||
      "",
  };

  tickets.push(newTicket);

  return newTicket;
}

async function updateTicketInDatabase(id: string, ticket: CreateTicketFormValues) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const ticketIndex = tickets.findIndex((t) => t.id === id);

  if (ticketIndex === -1) {
    throw new Error("Ticket not found");
  }

  const updatedTicket = {
    ...tickets[ticketIndex],
    ...ticket,
    updatedAt: new Date(),
    routeName:
      (await getRoutes()).find((route) => route.id === ticket.routeId)?.name || "",
  };

  tickets[ticketIndex] = updatedTicket;

  return updatedTicket;
}

export async function createTicket(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validationResult = createTicketSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const ticket = await saveTicketToDatabase(validationResult.data);
    revalidatePath("/tickets");

    return {
      success: true,
      ticket,
    };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return {
      success: false,
      errors: {
        _form: ["Failed to create ticket. Please try again."],
      },
    };
  }
}

export async function updateTicket(id: string, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());

  const validationResult = createTicketSchema.safeParse(rawData);

  if (!validationResult.success) {
    // Return validation errors
    return {
      success: false,
      errors: validationResult.error.message,
    };
  }

  try {
    const ticket = await updateTicketInDatabase(id, validationResult.data);

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${id}`);

    return {
      success: true,
      ticket,
    };
  } catch (error) {
    console.error("Error updating ticket:", error);
    return {
      success: false,
      errors: {
        _form: ["Failed to update ticket. Please try again."],
      },
    };
  }
}
