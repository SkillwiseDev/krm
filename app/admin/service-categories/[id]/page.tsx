import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryLandingForm from "@/app/admin/components/CategoryLandingForm";
import { getServiceCategoryById } from "@/lib/admin-store";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata: Metadata = {
  title: "Edit Category Landing | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type EditCategoryLandingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryLandingPage({
  params,
}: EditCategoryLandingPageProps) {
  await requireAdminPage();
  const { id } = await params;
  const category = await getServiceCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <section className="admin-section">
      <header className="admin-section__header">
        <div>
          <Link
            className="admin-service-form__back"
            href="/admin/service-categories"
          >
            Back to Categories
          </Link>
          <p className="admin-section__eyebrow">Admin</p>
          <h1>Edit Category Landing</h1>
          <p className="admin-section__description">
            Update landing content and hero image for{" "}
            <strong>{category.name}</strong>.{" "}
            <Link href={`/categories/${category.slug}`} target="_blank">
              View public page
            </Link>
          </p>
        </div>
      </header>

      <CategoryLandingForm category={category} />
    </section>
  );
}
