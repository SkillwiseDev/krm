import { redirect } from "next/navigation";

export type AdminToastType = "success" | "error";

export function adminPathWithToast(
  path: string,
  message: string,
  type: AdminToastType = "success",
): string {
  const [pathname, existingQuery = ""] = path.split("?");
  const params = new URLSearchParams(existingQuery);
  params.set("toast", type);
  params.set("message", message);
  return `${pathname}?${params.toString()}`;
}

export function redirectWithToast(
  path: string,
  message: string,
  type: AdminToastType = "success",
): never {
  redirect(adminPathWithToast(path, message, type));
}
