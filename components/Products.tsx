import Link from "next/link";

export type ProductItem = {
  id: string;
  title: string;
  href: string;
};

type ProductsProps = {
  products: ProductItem[];
};

export default function Products({ products }: ProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="products" id="services" aria-labelledby="products-title">
      <div className="products__inner">
        <h2 id="products-title">Our Products</h2>

        <div className="products__grid">
          {products.map((product) => (
            <Link className="product-card" key={product.id} href={product.href}>
              <h3>{product.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
