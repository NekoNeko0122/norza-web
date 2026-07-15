import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIAssistant from "@/components/ai/AIAssistant";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Discover Norzagaray | Tourism Guide to Bulacan's Hidden Gem",
  description:
    "Explore the caves, rivers, waterfalls, and heritage sites of Norzagaray, Bulacan: an interactive tourism guide with maps, reviews, and travel info.",
};

const NO_FLASH_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    if (stored === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AIAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
