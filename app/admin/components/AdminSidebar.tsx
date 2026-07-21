"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";

const navItems = [
  {
    href: "/admin/service-categories",
    label: "Service Category",
  },
  {
    href: "/admin/services",
    label: "Services",
  },
  {
    href: "/admin/form-submissions",
    label: "Form Submission",
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <p className="admin-sidebar__eyebrow">KRM Healthcare</p>
        <strong>Admin Panel</strong>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar__link${isActive ? " admin-sidebar__link--active" : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form className="admin-sidebar__logout" action={logoutAdmin}>
        <button type="submit">Sign out</button>
      </form>
    </aside>
  );
}
