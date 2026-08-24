"use client";

import { useEffect, useRef, useCallback } from "react";

const DIGITS = Array.from({ length: 10 }, (_, i) => i);
const ROW_HEIGHT = 36;
const VISIBLE_HEIGHT = 108;
// Padding must equal (visible height - one row) / 2 so scrollTop = index * ROW_HEIGHT
// centers that row exactly — using a whole extra row of padding here would
// shift every digit by one position once scrolled.
const PAD = (VISIBLE_HEIGHT - ROW_HEIGHT) / 2;

function DigitWheel({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ignoreScroll = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Direct assignment (not scrollTo) plus a short ignore window keeps the
    // scroll events this triggers from being misread as a user scroll and
    // bouncing `value` to the wrong digit.
    ignoreScroll.current = true;
    el.scrollTop = value * ROW_HEIGHT;
    const t = setTimeout(() => {
      ignoreScroll.current = false;
    }, 60);
    return () => clearTimeout(t);
  }, [value]);

  const handleScroll = useCallback(() => {
    if (ignoreScroll.current) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const el = ref.current;
      if (!el || ignoreScroll.current) return;
      const index = Math.round(el.scrollTop / ROW_HEIGHT);
      const clamped = Math.max(0, Math.min(9, index));
      el.scrollTo({ top: clamped * ROW_HEIGHT, behavior: "smooth" });
      if (clamped !== value) onChange(clamped);
    }, 120);
  }, [value, onChange]);

  return (
    <div
      className="relative h-[108px] w-12 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)]"
      style={{ pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.5 : 1 }}
    >
      <div
        ref={ref}
        onScroll={handleScroll}
        className="h-full snap-y snap-mandatory overflow-y-scroll scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingTop: PAD, paddingBottom: PAD }}
      >
        {DIGITS.map((d) => (
          <div
            key={d}
            className="flex snap-center items-center justify-center font-mono text-lg font-bold text-[var(--ink)]"
            style={{ height: ROW_HEIGHT }}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[36px] -translate-y-1/2 rounded-lg border-y-2 border-emerald-600/60" />
    </div>
  );
}

export function DigitTimePicker({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const tens = Math.floor(value / 10) % 10;
  const ones = value % 10;

  const setTens = (d: number) => onChange(Math.max(1, d * 10 + ones));
  const setOnes = (d: number) => onChange(Math.max(1, tens * 10 + d));

  return (
    <div className="flex items-center justify-center gap-1.5">
      <DigitWheel value={tens} onChange={setTens} disabled={disabled} />
      <DigitWheel value={ones} onChange={setOnes} disabled={disabled} />
      <span className="ml-1.5 text-xs font-semibold text-[var(--muted)]">min</span>
    </div>
  );
}
