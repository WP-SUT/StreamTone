"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import type { Ticket, TicketMessage, UserRole } from "@/types/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TicketChatProps {
  ticket: Ticket;
  currentUserId: string;
  currentUserRole: UserRole;
  getSenderName: (id: string, role: UserRole) => string;
  onSendMessage: (body: string) => Promise<void>;
  disabled?: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isStaffRole(role: UserRole) {
  return role === "support" || role === "admin";
}

export function TicketChat({
  ticket,
  currentUserId,
  currentUserRole,
  getSenderName,
  onSendMessage,
  disabled = false,
}: TicketChatProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sending || disabled) return;

    setSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-[400px] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {ticket.messages.map((msg: TicketMessage) => {
          const isMine = msg.senderId === currentUserId;
          const isStaff = isStaffRole(msg.senderRole);

          return (
            <div
              key={msg.id}
              className={cn("flex", isStaff ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3",
                  isStaff
                    ? "rounded-br-sm bg-purple-600/90 text-white"
                    : "rounded-bl-sm bg-zinc-800 text-zinc-200"
                )}
              >
                <p className="mb-1 text-xs font-medium opacity-80">
                  {getSenderName(msg.senderId, msg.senderRole)}
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.body}
                </p>
                <p
                  className={cn(
                    "mt-1.5 text-[10px] opacity-60",
                    isMine ? "text-right" : "text-left"
                  )}
                >
                  {formatTime(msg.sentAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {!disabled && ticket.status !== "closed" && (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-zinc-800 p-4"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your reply..."
            disabled={sending}
            className="flex-1 bg-zinc-800 border-zinc-700"
          />
          <Button type="submit" disabled={sending || !message.trim()}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      )}

      {disabled && (
        <div className="border-t border-zinc-800 p-4 text-center text-sm text-zinc-500">
          This ticket is closed. Reopen to send messages.
        </div>
      )}
    </div>
  );
}
