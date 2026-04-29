"use client";

import { 
  GraduationCap,
  CloudLightning,
  Trophy,
  Rocket,
  SatelliteDish
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16" style={{background: 'linear-gradient(135deg, #0B1D3A 0%, #132E59 50%, #0B1D3A 100%)'}}>
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
        src="/video/background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 z-10 pointer-events-none bg-linear-to-b from-transparent via-blue-950/30 to-blue-950" />

      <div className="relative z-20 flex flex-col items-center text-center px-4 py-20 max-w-5xl mx-auto">
        
        <h1 className="text-6xl md:text-6xl font-bold text-white drop-shadow-lg tracking-tight mb-6 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <span className="text-cyan-300">AWS Student Builder Group</span>
          <br />
          <span className="text-4xl md:text-4xl text-blue-200">LPU</span>
        </h1>
        
        <div className="text-2xl md:text-3xl text-blue-100 font-semibold mb-6 animate-fade-in-up font-mono border-b-2 border-cyan-400 pb-3" style={{animationDelay: '0.2s'}}>
          <span className="text-cyan-300">▸</span>
            Build Cloud Skills. Launch Careers.
          <span className="text-cyan-300">◂</span>
        </div>
        
        <p className="text-lg md:text-xl text-blue-50 font-normal mb-3 animate-fade-in-up max-w-3xl" style={{animationDelay: '0.3s'}}>
          India's premier AWS community at LPU. Join <span className="text-cyan-300 font-semibold">5,000+ students</span> mastering cloud computing, earning AWS certifications, and building real-world projects.
        </p>
        
        <div className="flex justify-center gap-4 mb-10 animate-fade-in-up text-sm text-blue-200 font-mono" style={{animationDelay: '0.4s'}}>
          <span className="border-l-2 border-r-2 border-cyan-400 px-3">
            <GraduationCap className="inline mr-2" size={16} />
            LEARNING
          </span>
          <span className="border-l-2 border-r-2 border-cyan-400 px-3">
            <CloudLightning className="inline mr-2" size={16} />
            BUILDING
          </span>
          <span className="border-l-2 border-r-2 border-cyan-400 px-3">
            <Trophy className="inline mr-2" size={16} />
            GROWING
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <a
            href="/auth/login"
            rel="noopener noreferrer"
            className="relative group px-4 py-4 rounded-none text-white font-bold text-lg border-3 border-cyan-300 bg-blue-900/60 hover:bg-blue-800/80 transition-all duration-300 comic-border uppercase tracking-wider"
          >
            <span className="relative z-10">
              <Rocket className="inline mr-2" size={20} />
              Join Now!
            </span>
          </a>
          <a
            href="#about"
            className="relative group px-4 py-4 rounded-none text-cyan-300 font-bold text-lg border-3 border-cyan-400 bg-transparent hover:bg-cyan-400/10 transition-all duration-300 comic-border uppercase tracking-wider"
          >
            <span className="relative z-10">
              <SatelliteDish className="inline mr-2" size={20} />
              EXPLORE
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
