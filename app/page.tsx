import Certifications from "@/components/Certifications";
import FactoryVideo from "@/components/FactoryVideo";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CustomerSuccess from "@/components/CustomerSuccess";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Products from "@/components/Products";
import Resources from "@/components/Resources";
import WhyChoose from "@/components/WhyChoose";
import { getServiceCategories } from "@/lib/admin-store";
import { getSiteCertifications } from "@/lib/site-certifications-store";
import { getSiteResources } from "@/lib/site-resources-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, siteResources, siteCertifications] = await Promise.all([
    getServiceCategories(),
    getSiteResources(),
    getSiteCertifications(),
  ]);
  const products = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <main>
      <Header />
      <Hero />
      <Products products={products} />
      <div className="product-support">
        <FactoryVideo />
        <Problems />
        <WhyChoose />
        <CustomerSuccess />
        <Certifications data={siteCertifications} />
      </div>
      <Resources data={siteResources} />
      <Footer />
    </main>
  );
}
