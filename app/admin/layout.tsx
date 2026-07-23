import { Suspense } from "react";
import AdminSidebar from "@/app/admin/components/AdminSidebar";
import AdminToaster from "@/app/admin/components/AdminToaster";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
      <Suspense fallback={null}>
        <AdminToaster />
      </Suspense>
    </div>
  );
}
