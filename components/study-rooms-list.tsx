"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UsersRound,
  VolumeX,
  Presentation,
  MessagesSquare,
  Search,
  Plus,
  ArrowLeft,
  Sparkles,
  Filter,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRooms, type RoomData, type Subject } from "@/lib/store";

export function StudyRoomsList() {
  const [rooms, setRooms] = useState<RoomData[]>(getRooms());
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New room form state
  const [newRoomName, setNewRoomName] = useState("");
  const [newSubject, setNewSubject] = useState<Subject>("Physics");
  const [newTopic, setNewTopic] = useState("");
  const [newType, setNewType] = useState<"Silent Focus" | "Teaching" | "Discussion">("Silent Focus");

  const filteredRooms = rooms.filter((room) => {
    const matchesType = selectedType === "All" || room.type === selectedType;
    const matchesSubject = selectedSubject === "All" || room.subject === selectedSubject;
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSubject && matchesSearch;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newTopic.trim()) return;

    const id = newRoomName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
    const created: RoomData = {
      id,
      name: newRoomName.trim(),
      subject: newSubject,
      topic: newTopic.trim(),
      type: newType,
      participantCount: 1,
      capacity: 25,
      accent: newType === "Silent Focus" ? "#2d6a4f" : newType === "Teaching" ? "#486581" : "#b56845",
      goal: `Study ${newTopic.trim()}`,
      participants: [
        { name: "Ailee", initials: "A", role: "Host", online: true, tone: "bg-emerald-100 text-emerald-800", isHost: true },
      ],
      initialMessages: [
        {
          id: "1",
          name: "Ailee",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Welcome to ${newRoomName.trim()}! Let's lock in.`,
          tone: "bg-emerald-100 text-emerald-800",
        },
      ],
    };

    const updated = [created, ...rooms];
    setRooms(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("lockin_rooms_v0", JSON.stringify(updated));
    }
    setCreateModalOpen(false);
    setNewRoomName("");
    setNewTopic("");
  };

  return (
    <AppShell activeNav="rooms">
      <div className="mx-auto max-w-5xl space-y-7 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <UsersRound size={13} />
              Collaborative Accountability
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Study Rooms
            </h1>
            <p className="mt-2 text-base text-[var(--muted)]">
              Choose a room that matches how you want to work right now.
            </p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)} className="gap-2 rounded-xl shadow-sm">
            <Plus size={16} />
            Create Study Room
          </Button>
        </div>

        {/* Room Type Tabs & Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Type selector pill tabs */}
            <div className="flex flex-wrap gap-2 rounded-2xl bg-zinc-100 p-1.5 dark:bg-zinc-800/80">
              {["All", "Silent Focus", "Teaching", "Discussion"].map((type) => {
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-white text-emerald-950 shadow-sm dark:bg-[#162019] dark:text-emerald-200"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {type === "Silent Focus" && <VolumeX size={14} />}
                    {type === "Teaching" && <Presentation size={14} />}
                    {type === "Discussion" && <MessagesSquare size={14} />}
                    {type === "All" ? "All Rooms" : type}
                  </button>
                );
              })}
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[var(--muted)]">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2 text-xs font-medium text-[var(--ink)] outline-none focus:border-emerald-700"
              >
                <option value="All">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by room title, topic, or subject..."
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--card)] pl-10 pr-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-zinc-400 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950"
            />
          </div>
        </div>

        {/* Room Cards Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => {
              const isSilent = room.type === "Silent Focus";
              const isTeaching = room.type === "Teaching";
              const isDiscussion = room.type === "Discussion";

              return (
                <article
                  key={room.id}
                  className="flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm transition hover:shadow-md hover:border-emerald-700/40 dark:hover:border-emerald-500/40"
                >
                  <div>
                    {/* Top status & room type */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ background: room.accent }}
                        />
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          {room.subject}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {isSilent && <VolumeX size={12} />}
                        {isTeaching && <Presentation size={12} />}
                        {isDiscussion && <MessagesSquare size={12} />}
                        {room.type}
                      </span>
                    </div>

                    {/* Room Name */}
                    <h2 className="mt-5 text-lg font-bold tracking-tight text-[var(--ink)]">
                      {room.name}
                    </h2>

                    {/* Topic description */}
                    <p className="mt-2 text-xs leading-relaxed text-[var(--muted)] min-h-[36px]">
                      {room.topic}
                    </p>

                    {/* Host/Speaker indicator */}
                    {isTeaching && room.host && (
                      <div className="mt-3 rounded-xl bg-violet-50 p-2.5 text-xs font-medium text-violet-900 dark:bg-violet-950/40 dark:text-violet-300">
                        👨‍🏫 {room.host} is teaching
                      </div>
                    )}

                    {isDiscussion && room.discussionQuestion && (
                      <div className="mt-3 rounded-xl bg-amber-50 p-2.5 text-xs font-medium text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 line-clamp-2">
                        💬 &ldquo;{room.discussionQuestion}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Footer with counts and CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
                      <UsersRound size={15} className="text-emerald-700" />
                      <strong>{room.participantCount}</strong>/{room.capacity} students
                    </span>
                    <Link href={`/rooms/${room.id}`}>
                      <Button size="sm" className="gap-1.5 rounded-xl px-4 font-semibold">
                        LOCK IN
                      </Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--card)] p-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              <UsersRound size={24} />
            </div>
            <h3 className="mt-4 text-base font-bold text-[var(--ink)]">
              No active rooms found
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              No rooms match your filter criteria. Start your own study space!
            </p>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="mt-5 gap-2 rounded-xl"
            >
              <Plus size={16} />
              Create Study Room
            </Button>
          </div>
        )}

        {/* Create Room Modal */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-2xl sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <Sparkles size={16} />
                  </span>
                  <h2 className="text-lg font-bold">Create Study Room</h2>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)]">
                    Room Name
                  </label>
                  <Input
                    required
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g. Physics Problem Solving Lab"
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--muted)]">
                      Subject
                    </label>
                    <select
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value as Subject)}
                      className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-emerald-700"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Biology">Biology</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--muted)]">
                      Room Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-emerald-700"
                    >
                      <option value="Silent Focus">Silent Focus</option>
                      <option value="Teaching">Teaching</option>
                      <option value="Discussion">Discussion</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)]">
                    Topic / Study Goal
                  </label>
                  <Input
                    required
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Solving Past Year Electromagnetic Induction Questions"
                    className="mt-1.5 rounded-xl"
                  />
                </div>

                <div className="mt-7 flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateModalOpen(false)}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 rounded-xl">
                    Create &amp; Enter
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
