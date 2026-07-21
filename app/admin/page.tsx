import { redirect } from "next/navigation";
import AdminLoginForm from "@/app/admin/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (isAuthenticated) {
    redirect("/admin/form-submissions");
  }

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="admin-panel__eyebrow">KRM Healthcare</p>
        <h1>Admin</h1>
        <p className="admin-panel__message">
          Enter the admin password to access this page.
        </p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
