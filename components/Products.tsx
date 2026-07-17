const products = [
  { name: "Hematology", featured: true },
  { name: "Rapid Test Kits" },
  { name: "Biochemistry" },
  { name: "Reagents" },
];

export default function Products() {
  return (
    <section className="products" id="services" aria-labelledby="products-title">
      <div className="products__inner">
        <h2 id="products-title">Our Products</h2>

        <div className="products__grid">
          {products.map((product) => (
            <article
              className={`product-card${product.featured ? " product-card--featured" : ""}`}
              key={product.name}
            >
              <h3>{product.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
