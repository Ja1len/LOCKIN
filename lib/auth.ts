"use client";

import type { Subject, ThemeMode } from "./store";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  institution: string;
  course: string;
  subjects: Subject[];
  avatarInitial: string;
  theme: ThemeMode;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  institution: string;
  course: string;
  subjects?: Subject[];
}

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function getCurrentUser(): Promise<UserAccount | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const data = await parseJson(res);
  return data.user ?? null;
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await parseJson(res);
  if (!res.ok) return { success: false, error: data.error || "Login failed." };
  return { success: true, user: data.user };
}

export async function registerUser(
  data: RegisterCredentials
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await parseJson(res);
  if (!res.ok) return { success: false, error: result.error || "Failed to create account." };
  return { success: true, user: result.user };
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function updateUserAccount(
  updates: Partial<Pick<UserAccount, "name" | "institution" | "course" | "subjects" | "theme">>
): Promise<UserAccount | null> {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) return null;
  const data = await parseJson(res);
  return data.profile ?? null;
}
