import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "One Last Thing... | Sugar.fit 5th Anniversary",
  description: "Before you go, we'd love to hear about your evening. Relive the Sugar.fit 5th Anniversary Celebration.",
  openGraph: {
    title: "One Last Thing...",
    description: "Before you go, we'd love to hear about your evening.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FCFBF8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans bg-[#FCFBF8] text-[#1D1C1A] antialiased min-h-screen selection:bg-[#5B2EFF] selection:text-white">
        {children}
      </body>
    </html>
  );
}
