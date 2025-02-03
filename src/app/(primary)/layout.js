import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import CheckRoom from "./checkRoom";

export default function RootLayout({ children }) {
  return (
    <>
      <CheckRoom />
      <Header />
      <main id="maintag" className="mincomp relative top-0 sm:top-[10vh] px-5 !min-h-screen !max-w-full back pb-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
