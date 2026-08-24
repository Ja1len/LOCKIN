"use client";

import { useEffect, useState } from "react";
import type { Subject } from "./store";

export function useSubjects(initial: Subject[], onPersist: (subjects: Subject[]) => void) {
  const [subjects, setSubjects] = useState<Subject[]>(initial);

  useEffect(() => {
    setSubjects(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.join("|")]);

  const addSubject = (name: string) => {
    const val = name.trim();
    if (!val || subjects.includes(val as Subject)) return;
    const updated = [...subjects, val as Subject];
    setSubjects(updated);
    onPersist(updated);
  };

  const removeSubject = (name: Subject) => {
    const updated = subjects.filter((s) => s !== name);
    setSubjects(updated);
    onPersist(updated);
  };

  return { subjects, addSubject, removeSubject };
}
