import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Servers from "@/components/Servers";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <Navbar />
      <Hero />
      <Features />
      <Servers />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
