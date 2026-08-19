"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { MessageCircle, Send, Sparkles, Smile, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveRoomMessage } from "@/lib/store";

export interface ChatMessage {
  id?: string;
  name: string;
  time: string;
  text: string;
  tone: string;
}

interface ChatPanelProps {
  roomId?: string;
  roomType?: string;
  initialMessages?: ChatMessage[];
}

export function ChatPanel({
  roomId = "physics-focus",
  roomType = "Silent Focus",
  initialMessages = [],
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      name: "Ailee",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text,
      tone: "bg-emerald-100 text-emerald-800",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    if (roomId) {
      saveRoomMessage(roomId, text, "Ailee");
    }
  };

  const isSilent = roomType === "Silent Focus";

  return (
    <aside className="flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <MessageCircle size={16} />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[var(--ink)]">Room Chat</h2>
            <p className="text-[11px] text-[var(--muted)]">
              {isSilent ? "Minimal & encouragement only" : "Active study discussion"}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-[var(--muted)] dark:bg-zinc-800">
          {messages.length} msgs
        </span>
      </div>

      {/* Silent Room Guidance Banner */}
      {isSilent && (
        <div className="border-b border-emerald-100 bg-emerald-50/60 px-4 py-2 text-[11px] text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-300 flex items-center gap-1.5">
          <Sparkles size={13} className="shrink-0 text-emerald-600" />
          <span>Silent Focus mode: Keep messages brief to preserve deep concentration.</span>
        </div>
      )}

      {/* Message Feed */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 max-h-[420px]">
        {messages.map((item, index) => {
          const isMe = item.name === "Ailee";
          return (
            <div
              key={item.id || `${item.name}-${index}`}
              className={cn("flex gap-2.5", isMe ? "flex-row-reverse" : "flex-row")}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold shadow-xs",
                  item.tone || "bg-zinc-100 text-zinc-800"
                )}
              >
                {item.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </span>

              <div
                className={cn(
                  "max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs",
                  isMe
                    ? "bg-emerald-800 text-white rounded-tr-none"
                    : "bg-zinc-100 dark:bg-zinc-800/80 text-[var(--ink)] rounded-tl-none"
                )}
              >
                <div
                  className={cn(
                    "flex items-baseline justify-between gap-2 mb-1 text-[10px]",
                    isMe ? "text-emerald-200" : "text-[var(--muted)]"
                  )}
                >
                  <span className="font-semibold">{item.name}</span>
                  <span>{item.time}</span>
                </div>
                <p className="break-words">{item.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="border-t border-[var(--line)] p-3 bg-[var(--paper)]/50">
        <div className="flex gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isSilent ? "Send quiet check-in..." : "Type a question or message..."}
            className="h-10 min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 text-xs text-[var(--ink)] outline-none placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950"
          />
          <Button
            type="submit"
            size="sm"
            aria-label="Send message"
            className="h-10 w-10 px-0 rounded-xl shrink-0"
          >
            <Send size={15} />
          </Button>
        </div>
      </form>
    </aside>
  );
}
