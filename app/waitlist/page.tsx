
import Footer from "@/components/Footer";
import { ClivaStarsBackground } from "@/components/Stars";
import Features from "@/components/waitlist/Features";
import Hero from "@/components/waitlist/Hero";
import WaitlistForm from "@/components/waitlist/WaitlistForm";

export default function WaitlistPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden font-sans">
      <ClivaStarsBackground density={200} />
      {/* Dynamic Background: Subtle Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <Hero />

        <div className="py-20 border-y border-white/[0.05]">
          <Features />
        </div>

        <section id="join" className="py-32">
          <WaitlistForm />
        </section>

      </div>
      <Footer />
    </main>
  );
}