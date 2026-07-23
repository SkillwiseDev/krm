"use client";

import { useState } from "react";

export type ProductCategoryItem = {
  id: string;
  name: string;
};

type ProductsProps = {
  products: ProductCategoryItem[];
};

export default function Products({ products }: ProductsProps) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="products" id="services" aria-labelledby="products-title">
      <div className="products__inner">
        <h2 id="products-title">Our Products</h2>

        <div className="products__grid">
          {products.map((product) => (
            <button
              className={`product-card${
                selectedProduct === product.id
                  ? " product-card--featured"
                  : ""
              }`}
              key={product.id}
              type="button"
              aria-pressed={selectedProduct === product.id}
              onClick={() => setSelectedProduct(product.id)}
            >
              <h3>{product.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
