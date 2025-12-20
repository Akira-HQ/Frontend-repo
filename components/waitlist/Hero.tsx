export default function Hero() {
  return (
    <section className="pt-32 pb-20 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-10 transition-colors hover:bg-white/[0.05]">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          The Future of E-commerce
        </span>
      </div>

      <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
        Meet Cliva. <br /> Your AI Sales Manager.
      </h1>

      <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
        Cliva understands buyer intent, automates complex sales conversations,
        and scales your store intelligently while you focus on brand.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <a href="#join" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
          Secure Early Access
        </a>
        <a href="/" className="px-8 py-4 bg-transparent border border-white/10 rounded-full font-medium hover:bg-white/5 transition-all" >
          Learn More
        </a>
      </div>
    </section>
  );
}