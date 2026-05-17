import Navbar from "@/components/landing/Navbar";
import About from "@/components/landing/About";
import Footer from "@/components/landing/Footer";

export default function AboutUsLandingPage() {
  return (
    <main className="min-h-screen bg-[#0a2e1a] overflow-hidden">
      <Navbar />
      <div className="pt-20">
        <About />
      </div>
      <Footer />
    </main>
  );
}
