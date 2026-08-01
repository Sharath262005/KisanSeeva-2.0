import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import Stats from "../../components/landing/Stats";
import Services from "../../components/landing/Services";
import Features from "../../components/landing/Features";
import HowItWorks from "../../components/landing/HowItWorks";
import Testimonials from "../../components/landing/Testimonials";
import CTA from "../../components/landing/CTA";
import RegisterPortalSection from "../../components/landing/RegisterPortalSection";
import LoginPortalSection from "../../components/landing/LoginPortalSection";
import Footer from "../../components/layout/Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main>
        <Hero />
        <Stats />
        <Services />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CTA />
        {/* Role-based Register Portal */}
        <RegisterPortalSection />
        {/* Role-based Login Portal */}
        <LoginPortalSection />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
