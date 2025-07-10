import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "./__components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { sendWhatsappMessage } from "@/lib/wa_me";
import WhatsappIcon from "@/components/WhatsappIcon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TORQ Rides - Premium Motorcycle Rentals",
  description:
    "Experience the thrill of premium motorcycles with TORQ Rides. Your adventure starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const url = sendWhatsappMessage();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
          <Link
            href={url}
            target="_blank"
            className="cursor-pointer fixed bottom-4 right-4 z-50"
          >
            <WhatsappIcon />
          </Link>
        </ThemeProvider>
      </body>
    </html>
  );
}
