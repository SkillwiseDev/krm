import Image from "next/image";
import Link from "next/link";
import productFallback from "@/public/image.png";

export type ProductItem = {
  id: string;
  title: string;
  href: string;
  imageUrl?: string;
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
            <Link
              className="product-card product-card--media"
              key={product.id}
              href={product.href}
            >
              <span className="product-card__media">
                {product.imageUrl ? (
                  <Image
                    className="product-card__image"
                    src={product.imageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 70vw, 260px"
                  />
                ) : (
                  <Image
                    className="product-card__image"
                    src={productFallback}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 70vw, 260px"
                  />
                )}
              </span>

              <span className="product-card__overlay">
                <h3>{product.title}</h3>
                <span className="product-card__cta">Read More</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
