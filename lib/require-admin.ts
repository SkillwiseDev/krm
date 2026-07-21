import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function requireAdminPage(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}
