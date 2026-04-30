export default function OrganizerInfo() {
return (
    <section className="w-full py-20 px-4 relative">
      <div className="grid-lines absolute inset-0"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-cyan-400">▸</span> AWS Student Builder Group <span className="text-cyan-300">LPU</span>
          </h2>
        </div>

        <div className="bg-blue-950/50 rounded-none p-0 border-3 border-cyan-400 comic-border relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400/30"></div>
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div className="text-center md:text-left">
              <img src="/image/logo/aws_student_builder_group.png" alt="AWS Student Builder Group LPU" className="h-16 mb-6 mx-auto md:mx-0" />
              <h3 className="text-3xl font-bold text-cyan-300 mb-2 uppercase tracking-wider">Empowering Cloud Innovators</h3>
              <p className="text-base text-blue-300 mb-4 font-mono uppercase tracking-widest">[GROUND_STATION] Lovely Professional University</p>
              <p className="text-blue-100/70 leading-relaxed mb-6 text-sm font-mono">
                AWS Student Builder Group at LPU is a vibrant student-driven community dedicated to demystifying cloud computing and empowering the next generation of cloud architects, developers, and innovators. We provide industry-standard training, hands-on projects, and career acceleration opportunities to students across all skill levels.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900/50 p-6 border-2 border-cyan-400 relative group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400/20" style={{animation: 'telemetryPulse 2s infinite'}}></div>
                <div className="text-3xl font-bold text-cyan-300 mb-2 font-mono">5K+</div>
                <div className="text-blue-300 text-xs uppercase font-mono tracking-widest">Active Members</div>
              </div>
              <div className="bg-blue-900/50 p-6 border-2 border-cyan-400 relative group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400/20" style={{animation: 'telemetryPulse 2s infinite', animationDelay: '0.3s'}}></div>
                <div className="text-3xl font-bold text-cyan-300 mb-2 font-mono">10+</div>
                <div className="text-blue-300 text-xs uppercase font-mono tracking-widest">Annual Events</div>
              </div>
              <div className="bg-blue-900/50 p-6 border-2 border-cyan-400 relative group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400/20" style={{animation: 'telemetryPulse 2s infinite', animationDelay: '0.6s'}}></div>
                <div className="text-3xl font-bold text-cyan-300 mb-2 font-mono">100+</div>
                <div className="text-blue-300 text-xs uppercase font-mono tracking-widest">AWS Certified</div>
              </div>
              <div className="bg-blue-900/50 p-6 border-2 border-cyan-400 relative group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400/20" style={{animation: 'telemetryPulse 2s infinite', animationDelay: '0.9s'}}></div>
                <div className="text-3xl font-bold text-cyan-300 mb-2 font-mono">50h+</div>
                <div className="text-blue-300 text-xs uppercase font-mono tracking-widest">Training/Year</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="control-badge p-4 inline-block mb-6">
            Trusted By
          </div>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            {[
              { name: 'AWS', logo: '/image/logo/aws.png' },
              { name: 'Niwi.ai', logo: '/image/logo/niwi.png' },
              { name: '.XYZ Registry', logo: '/image/logo/xyz.png' },
              { name: 'LPU', logo: '/image/logo/lpu.png' }
            ].map((partner) => (
              <div key={partner.name} className="px-4 uppercase text-xs font-mono text-blue-100 tracking-widest flex flex-col items-center gap-2">
          <img src={partner.logo} alt={partner.name} className="h-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
