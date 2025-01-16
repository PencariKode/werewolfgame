import { Poppins, Frijole } from "next/font/google";
import "./globals.css";

import "@fa/css/all.css"
import "@fa/css/sharp-duotone-solid.css"
import "@fa/css/sharp-regular.css"
import "@fa/css/sharp-light.css"
import "@fa/css/sharp-solid.css"
import "@fa/css/sharp-thin.css"
// import "@fa/css/.css"

import Header from "@/app/Header"
import Footer from "./Footer";

const poppins = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

const frijole = Frijole({
  variable: "--font-frijole",
  subsets: ["latin"],
  weight: "400"
});

export const metadata = {
  title: "PANJI",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      </head>
      <body
        className={`${poppins.variable} ${frijole.variable} !no-scrollbar antialiased bg-dark-bg text-dark-text max-w-full min-w-full min-h-screen `}
      >
        <Header />
        <main id="maintag" className="mincomp relative top-0 sm:top-[9vh] px-5 !min-h-screen !max-w-full back pb-10">
        {children}
        </main> 

        <Footer />
      </body>
    </html>
  );
}
