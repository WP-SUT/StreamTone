import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { StorageProvider } from "@/components/stoarge/storage-provider";
import { AudioProvider } from "@/components/audio/audio-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamTone",
  description: "Music streaming platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <StorageProvider>
          <AudioProvider>
            {children}
            <Toaster />
          </AudioProvider>
        </StorageProvider>
      </body>
    </html>
  );
}
