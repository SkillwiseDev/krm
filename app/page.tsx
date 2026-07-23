import Certifications from "@/components/Certifications";
import FactoryVideo from "@/components/FactoryVideo";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import CustomerSuccess from "@/components/CustomerSuccess";
import Hero from "@/components/Hero";
import Problems from "@/components/Problems";
import Products from "@/components/Products";
import Resources from "@/components/Resources";
import WhyChoose from "@/components/WhyChoose";
import { getServices } from "@/lib/admin-store";
import { getSiteCertifications } from "@/lib/site-certifications-store";
import { getSiteResources } from "@/lib/site-resources-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, siteResources, siteCertifications] = await Promise.all([
    getServices(),
    getSiteResources(),
    getSiteCertifications(),
  ]);
  const products = services.map((service) => ({
    id: service.id,
    title: service.title,
    href: `/products/${service.slug}`,
  }));

  return (
    <main>
      <SiteHeader />
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
