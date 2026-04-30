import type { Metadata } from "next";
import { NavigationBar } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AWS Student Builder Group LPU | Learn Cloud Computing & AWS at Lovely Professional University",
    template: "%s | AWS Student Builder Group LPU",
  },

  description:
    "AWS Student Builder Group at Lovely Professional University (LPU) is a student-led technical community focused on cloud computing, AWS certifications, hands-on labs, hackathons, and industry-ready skills.",

  keywords: [
    "AWS Student Builder Group LPU",
    "AWS Student Club India",
    "Cloud Computing LPU",
    "AWS Workshops LPU",
    "AWS Certifications Students",
    "Cloud Computing Community India",
    "AWS Student Community",
    "LPU Tech Club",
    "AWS Learning Community",
  ],

  authors: [{ name: "AWS Student Builder Group LPU" }],
  creator: "AWS Student Builder Group LPU",
  publisher: "AWS Student Builder Group LPU",

  metadataBase: new URL("https://awslpu.in"),

  openGraph: {
    title: "AWS Student Builder Group LPU",
    description:
      "Join AWS Student Builder Group LPU to learn cloud computing, build real-world projects, attend workshops, and grow with a community of cloud engineers.",
    url: "https://awslpu.in",
    siteName: "AWS Student Builder Group LPU",
    images: [
      {
        url: "/og-image.png", // add later
        width: 1200,
        height: 630,
        alt: "AWS Student Builder Group LPU",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AWS Student Builder Group LPU",
    description:
      "Student-led AWS cloud computing community at Lovely Professional University.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://awslpu.in",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="relative min-h-screen font-sans antialiased overflow-x-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0B1D3A 0%, #132E59 50%, #0B1D3A 100%)",
          backgroundAttachment: "fixed",
        }}
      >
        <NavigationBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
