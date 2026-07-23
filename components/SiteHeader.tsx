import Header from "@/components/Header";
import { getServiceCategories } from "@/lib/admin-store";

export default async function SiteHeader() {
  const categories = await getServiceCategories();
  const categoryItems = categories.map((category) => ({
    href: `/categories/${category.slug}`,
    label: category.name,
  }));

  return <Header categoryItems={categoryItems} />;
}
