
import {
  GraduationCap,
  Laptop,
  Users,
  UserCog,
  Trophy,
  Award
} from "lucide-react";

export default function WhatWeOffer() {
  const features = [
    {
      icon: GraduationCap,
      title: "Structured Learning",
      description:
        "Guided paths for AWS certifications from Cloud Practitioner to Solutions Architect with comprehensive learning materials."
    },
    {
      icon: Laptop,
      title: "Hands-on Labs",
      description:
        "Real AWS accounts, practical projects, and step-by-step learning repositories to master cloud technologies."
    },
    {
      icon: Users,
      title: "Industry Connection",
      description:
        "Guest speakers, mentorship programs, and internship opportunities with top tech companies and AWS partners."
    },
    {
      icon: UserCog,
      title: "Expert Mentors",
      description:
        "Learn directly from AWS-certified professionals and industry veterans with real-world experience."
    },
    {
      icon: Trophy,
      title: "Hackathons & Events",
      description:
        "Compete, build projects, and win prizes in regular challenges, workshops, and hands-on development events."
    },
    {
      icon: Award,
      title: "Certifications",
      description:
        "Get recognized with AWS and community certificates upon completion of learning tracks and achievements."
    }
  ];


  return (
    <section id="about" className="w-full py-20 px-4 relative">
      <div className="grid-lines absolute inset-0"></div>
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        <div className="text-center mb-16 control-badge p-8 border-3 border-cyan-400 comic-border mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-cyan-300">▸</span> What We <span className="text-cyan-400">OFFER</span>
          </h2>
          <p className="text-blue-100 text-base max-w-3xl mx-auto leading-relaxed font-mono">
            AWS Student Builder Group LPU provides comprehensive learning, hands-on experience, industry connections, and career opportunities for students passionate about cloud computing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group bg-blue-950/50 p-6 border-3 border-cyan-400 hover:border-cyan-300 transition-all duration-300 comic-border relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-cyan-400/20"
                  style={{ animation: "telemetryPulse 2s infinite" }}
                />

                <div className="mb-4 text-cyan-300 group-hover:text-cyan-200 transition-all duration-300">
                  <Icon size={42} strokeWidth={1.6} />
                </div>

                <h3 className="text-lg font-bold text-cyan-300 mb-3 uppercase tracking-wider">
                  {feature.title}
                </h3>

                <p className="text-blue-100/70 text-sm leading-relaxed font-mono">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
