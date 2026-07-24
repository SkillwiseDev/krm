import Certifications from "@/components/Certifications";
import FactoryVideo from "@/components/FactoryVideo";
import Footer from "@/components/Footer";
import SiteHeader from "@/components/SiteHeader";
import CustomerSuccess from "@/components/CustomerSuccess";
import Hero from "@/components/Hero";
import HomeCategories from "@/components/HomeCategories";
import Problems from "@/components/Problems";
import Products from "@/components/Products";
import Resources from "@/components/Resources";
import WhyChoose from "@/components/WhyChoose";
import { getServiceCategories, getServices } from "@/lib/admin-store";
import { getSiteCertifications } from "@/lib/site-certifications-store";
import { getSiteResources } from "@/lib/site-resources-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, categories, siteResources, siteCertifications] =
    await Promise.all([
      getServices(),
      getServiceCategories(),
      getSiteResources(),
      getSiteCertifications(),
    ]);
  const products = services.map((service) => ({
    id: service.id,
    title: service.title,
    href: `/products/${service.slug}`,
  }));
  const categoryItems = categories.map((category) => ({
    id: category.id,
    name: category.name,
    href: `/categories/${category.slug}`,
  }));

  return (
    <main className="home-page">
      <SiteHeader />
      <Hero />
      <HomeCategories categories={categoryItems} />
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
