import { storage } from "@/lib/storage";
import type { Ticket, TicketMessage, TicketStatus, UserRole } from "@/types/models";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    await delay();
    return storage.tickets.getAll();
  },

  async getById(id: string): Promise<Ticket | undefined> {
    await delay();
    return storage.tickets.findById(id);
  },

  async sendMessage(
    ticketId: string,
    senderId: string,
    senderRole: UserRole,
    body: string
  ): Promise<TicketMessage> {
    await delay(300);
    const ticket = storage.tickets.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const message: TicketMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      senderRole,
      body: body.trim(),
      sentAt: new Date().toISOString(),
    };

    const updated: Ticket = {
      ...ticket,
      messages: [...ticket.messages, message],
      status: ticket.status === "open" ? "in_progress" : ticket.status,
      updatedAt: new Date().toISOString(),
    };

    storage.tickets.upsert(updated);
    return message;
  },

  async updateStatus(ticketId: string, status: TicketStatus): Promise<Ticket> {
    await delay(300);
    const ticket = storage.tickets.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    const updated: Ticket = {
      ...ticket,
      status,
      updatedAt: new Date().toISOString(),
    };

    storage.tickets.upsert(updated);
    return updated;
  },

  getOpenerName(openerId: string): string {
    const user = storage.users.findById(openerId);
    if (user) return user.displayName;
    const artist = storage.artists.findById(openerId);
    if (artist) return artist.artistName;
    return "Unknown user";
  },
};
