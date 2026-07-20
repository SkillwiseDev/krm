"use client";

import { useState } from "react";

const products = [
  { name: "Hematology" },
  { name: "Rapid Test Kits" },
  { name: "Biochemistry" },
  { name: "Reagents" },
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <section className="products" id="services" aria-labelledby="products-title">
      <div className="products__inner">
        <h2 id="products-title">Our Products</h2>

        <div className="products__grid">
          {products.map((product) => (
            <button
              className={`product-card${
                selectedProduct === product.name
                  ? " product-card--featured"
                  : ""
              }`}
              key={product.name}
              type="button"
              aria-pressed={selectedProduct === product.name}
              onClick={() => setSelectedProduct(product.name)}
            >
              <h3>{product.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
