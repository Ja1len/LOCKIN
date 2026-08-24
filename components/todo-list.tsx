"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ListTodo, Plus } from "lucide-react";
import type { Todo } from "@/lib/store";
import { addTodo, completeTodo } from "@/lib/api-client";

interface TodoListProps {
  todos: Todo[];
  onChange: (todos: Todo[]) => void;
}

export function TodoList({ todos, onChange }: TodoListProps) {
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const title = input.trim();
    if (!title || submitting) return;

    setSubmitting(true);
    setInput("");
    const todo = await addTodo(title);
    setSubmitting(false);
    if (todo) onChange([todo, ...todos]);
  };

  const handleComplete = async (id: string) => {
    onChange(todos.filter((t) => t.id !== id));
    await completeTodo(id);
  };

  return (
    <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ListTodo size={16} />
          </span>
          <h3 className="text-sm font-bold text-[var(--ink)]">To-Do</h3>
        </div>
        <span className="text-xs text-[var(--muted)]">{todos.length} active</span>
      </div>

      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you need to do?"
          className="h-9 min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-3 text-xs text-[var(--ink)] outline-none placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950"
        />
        <button
          type="submit"
          disabled={!input.trim() || submitting}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-800 text-white transition hover:bg-emerald-900 disabled:opacity-40"
          aria-label="Add task"
        >
          <Plus size={15} />
        </button>
      </form>

      <div className="mt-3 space-y-1.5">
        {todos.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs font-semibold text-[var(--ink)]">You&apos;re all caught up.</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">Add a task to stay organised.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 24, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-[var(--paper)]"
              >
                <button
                  onClick={() => handleComplete(todo.id)}
                  aria-label={`Complete ${todo.title}`}
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-[var(--line)] text-transparent transition hover:border-emerald-600 hover:text-emerald-600"
                >
                  <Check size={12} strokeWidth={3} />
                </button>
                <span className="truncate text-xs text-[var(--ink)]">{todo.title}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
