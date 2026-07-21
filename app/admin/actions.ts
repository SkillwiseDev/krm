"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export type LoginState = {
  error?: string;
};

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || !password.trim()) {
    return { error: "Password is required." };
  }

  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Admin access is not configured." };
  }

  if (!verifyAdminPassword(password)) {
    return { error: "Incorrect password." };
  }

  await setAdminSession();
  redirect("/admin/form-submissions");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  redirect("/admin");
}
