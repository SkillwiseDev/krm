import Link from "next/link";

export type HomeCategoryItem = {
  id: string;
  name: string;
  href: string;
};

type HomeCategoriesProps = {
  categories: HomeCategoryItem[];
};

export default function HomeCategories({ categories }: HomeCategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      className="products home-categories"
      aria-labelledby="home-categories-title"
    >
      <div className="products__inner">
        <h2 id="home-categories-title" className="sr-only">
          Product Categories
        </h2>

        <div className="products__grid">
          {categories.map((category) => (
            <Link
              className="product-card"
              key={category.id}
              href={category.href}
            >
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
