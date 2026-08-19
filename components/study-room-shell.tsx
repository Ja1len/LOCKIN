"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ChatPanel } from "@/components/study-room/chat-panel";
import { ParticipantList } from "@/components/study-room/participant-list";
import { PomodoroTimer } from "@/components/study-room/pomodoro-timer";
import { RoomControls } from "@/components/study-room/room-controls";
import { RoomGoalCard } from "@/components/study-room/room-goal-card";
import { StudyRoomHeader } from "@/components/study-room/study-room-header";
import { TeachingCanvas } from "@/components/study-room/teaching-canvas";
import { DiscussionBoard } from "@/components/study-room/discussion-board";
import { getRoomById, addSession, type RoomData, type Subject } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function StudyRoomShell({ roomId = "physics-focus" }: { roomId?: string }) {
  const [room, setRoom] = useState<RoomData | undefined>(undefined);
  const [running, setRunning] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [sessionCompletedAlert, setSessionCompletedAlert] = useState(false);

  useEffect(() => {
    const loaded = getRoomById(roomId);
    setRoom(loaded);
  }, [roomId]);

  const activeRoom = room || {
    id: roomId,
    name: "Physics Focus",
    subject: "Physics" as Subject,
    topic: "Electromagnetic Induction",
    type: "Silent Focus" as const,
    participantCount: 18,
    capacity: 25,
    accent: "#2d6a4f",
    goal: "Complete Chapter 4 Exercise Questions",
    participants: [
      { name: "Ailee", initials: "A", role: "You", online: true, tone: "bg-emerald-100 text-emerald-800" },
      { name: "Aiman", initials: "AI", role: "Room Host", online: true, tone: "bg-sky-100 text-sky-800", isHost: true },
      { name: "Sarah Tan", initials: "ST", role: "Member", online: true, tone: "bg-amber-100 text-amber-800" },
      { name: "Daniel Lim", initials: "DL", role: "Member", online: true, tone: "bg-violet-100 text-violet-800" },
    ],
    initialMessages: [
      { id: "1", name: "Aiman", time: "10:00 AM", text: "Welcome to Silent Focus! Let's lock in for this block.", tone: "bg-sky-100 text-sky-800" },
    ],
  };

  const handleSessionComplete = (subject: Subject) => {
    addSession(subject, 25, activeRoom.name);
    setSessionCompletedAlert(true);
    setTimeout(() => setSessionCompletedAlert(false), 5000);
  };

  const isSilent = activeRoom.type === "Silent Focus";
  const isTeaching = activeRoom.type === "Teaching";
  const isDiscussion = activeRoom.type === "Discussion";

  return (
    <div
      className={
        focusMode
          ? "min-h-screen bg-[#0d130f] text-[#e5f0e8] transition-colors duration-300"
          : "min-h-screen bg-[var(--paper)] text-[var(--ink)] transition-colors duration-300"
      }
    >
      {/* Header */}
      <header
        className={
          focusMode
            ? "border-b border-emerald-950/40 bg-[#0d130f]/90 px-5 py-3 backdrop-blur"
            : "border-b border-[var(--line)] bg-[var(--paper)]/90 px-5 py-3 backdrop-blur md:px-8"
        }
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-800 text-white">
              <Sparkles size={14} />
            </span>
            <span className="text-lg">lockin</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[var(--muted)] sm:inline">
              {activeRoom.name} • {activeRoom.type}
            </span>
            <Link href="/rooms">
              <Button size="sm" variant="outline" className="rounded-xl text-xs">
                All Rooms
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Room View */}
      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 md:px-8 md:py-8">
        {/* Completion Toast Notification */}
        {sessionCompletedAlert && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-emerald-700 text-white p-4 shadow-xl animate-in slide-in-from-top duration-300">
            <CheckCircle2 size={22} className="shrink-0 text-[#bfe3cf]" />
            <div>
              <p className="font-bold text-sm">Focus block completed!</p>
              <p className="text-xs text-emerald-100">
                25 minutes of {activeRoom.subject} has been recorded in your study dashboard and streak.
              </p>
            </div>
          </div>
        )}

        {/* Room Header Info */}
        <StudyRoomHeader
          roomName={activeRoom.name}
          subject={activeRoom.subject}
          topic={activeRoom.topic}
          roomType={activeRoom.type}
          participantCount={activeRoom.participantCount}
          capacity={activeRoom.capacity}
        />

        {/* Dynamic Room Content depending on Room Type */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {/* 1. Silent Focus Layout */}
            {isSilent && (
              <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-sm">
                <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <PomodoroTimer
                    running={running}
                    resetKey={resetKey}
                    onComplete={handleSessionComplete}
                    defaultSubject={activeRoom.subject}
                    roomType={activeRoom.type}
                  />
                  <RoomGoalCard
                    goal={activeRoom.goal || "Complete Assignment Exercises"}
                    isSilent={true}
                  />
                </div>
                <ParticipantList
                  participants={activeRoom.participants}
                  roomType={activeRoom.type}
                />
              </section>
            )}

            {/* 2. Teaching Room Layout */}
            {isTeaching && (
              <div className="space-y-6">
                <TeachingCanvas
                  hostName={activeRoom.host || "Daniel Lim"}
                  topic={activeRoom.topic}
                  subject={activeRoom.subject}
                />
                <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-sm">
                  <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[minmax(0,1fr)_260px]">
                    <PomodoroTimer
                      running={running}
                      resetKey={resetKey}
                      onComplete={handleSessionComplete}
                      defaultSubject={activeRoom.subject}
                      roomType={activeRoom.type}
                    />
                    <RoomGoalCard
                      goal={activeRoom.goal || "Follow live lecture & take notes"}
                      isSilent={false}
                    />
                  </div>
                  <ParticipantList
                    participants={activeRoom.participants}
                    roomType={activeRoom.type}
                  />
                </section>
              </div>
            )}

            {/* 3. Discussion Room Layout */}
            {isDiscussion && (
              <div className="space-y-6">
                <DiscussionBoard
                  question={
                    activeRoom.discussionQuestion ||
                    "Why does benzene have resonance stabilization energy compared to 1,3,5-cyclohexatriene?"
                  }
                  subject={activeRoom.subject}
                />
                <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-sm">
                  <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[minmax(0,1fr)_260px]">
                    <PomodoroTimer
                      running={running}
                      resetKey={resetKey}
                      onComplete={handleSessionComplete}
                      defaultSubject={activeRoom.subject}
                      roomType={activeRoom.type}
                    />
                    <RoomGoalCard
                      goal={activeRoom.goal || "Collaborate on practice set"}
                      isSilent={false}
                    />
                  </div>
                  <ParticipantList
                    participants={activeRoom.participants}
                    roomType={activeRoom.type}
                  />
                </section>
              </div>
            )}
          </div>

          {/* Interactive Chat Column */}
          <ChatPanel
            roomId={activeRoom.id}
            roomType={activeRoom.type}
            initialMessages={activeRoom.initialMessages}
          />
        </div>
      </main>

      {/* Floating Bottom Room Controls */}
      <RoomControls
        running={running}
        focusMode={focusMode}
        roomName={activeRoom.name}
        roomType={activeRoom.type}
        onToggle={() => setRunning(!running)}
        onReset={() => {
          setRunning(false);
          setResetKey((prev) => prev + 1);
        }}
        onFocusMode={() => setFocusMode(!focusMode)}
      />
    </div>
  );
}
