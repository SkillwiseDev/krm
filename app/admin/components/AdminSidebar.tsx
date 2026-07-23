"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";

const navItems = [
  {
    href: "/admin/service-categories",
    label: "Product Categories",
  },
  {
    href: "/admin/services",
    label: "Services",
  },
  {
    href: "/admin/applications",
    label: "Applications",
  },
  {
    href: "/admin/downloads",
    label: "Downloads",
  },
  {
    href: "/admin/faqs",
    label: "FAQs",
  },
  {
    href: "/admin/resources",
    label: "Resources & Downloads",
  },
  {
    href: "/admin/technical-resources",
    label: "Technical Resources",
  },
  {
    href: "/admin/certifications",
    label: "Trust & Certifications",
  },
  {
    href: "/admin/form-submissions",
    label: "Form Submission",
  },
  {
    href: "/admin/form-submissions?form=Booking",
    label: "Bookings",
  },
  {
    href: "/admin/form-submissions?form=Technical%20Resource%20Download",
    label: "Resource Downloads",
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formFilter = searchParams.get("form");

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <p className="admin-sidebar__eyebrow">KRM Healthcare</p>
        <strong>Admin Panel</strong>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {navItems.map((item) => {
          const itemUrl = new URL(item.href, "http://local");
          const itemForm = itemUrl.searchParams.get("form");
          const isFormFilterLink = itemForm !== null;
          const isFormSubmissionsRoot =
            item.href === "/admin/form-submissions";

          const isActive = isFormFilterLink
            ? pathname === "/admin/form-submissions" && formFilter === itemForm
            : isFormSubmissionsRoot
              ? pathname === "/admin/form-submissions" && !formFilter
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

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
