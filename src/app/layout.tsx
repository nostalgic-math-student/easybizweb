import "@/styles/globals.css";
import { Roboto } from "next/font/google";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// Importing the Roboto font with different weights
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Add weights as needed
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
