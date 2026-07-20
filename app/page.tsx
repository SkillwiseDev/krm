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

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Products />
      <div className="product-support">
        <FactoryVideo />
        <Problems />
        <WhyChoose />
        <CustomerSuccess />
        <Certifications />
      </div>
      <Resources />
      <Footer />
    </main>
  );
}
