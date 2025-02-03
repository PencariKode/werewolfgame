import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <Header />
            <main id="maintag" className="mincomp relative top-0 sm:top-[10vh] px-5 !min-h-screen !max-w-full back pb-10 flex flex-col justify-center items-center text-center">
                <h1 className="font-bold text-4xl mincomp text-center">404</h1>
                <p className="mincomp text-center text-xl font-semibold">Halaman yang anda cari tidak ditemukan</p>
                <p className="text-base">Pastikan URL yang anda masukkan sudah benar!</p>
                <Link href="/" className="mincomp text-center hover:italic underline text-blue-700">Kembali ke Beranda</Link>
            </main>
            <Footer />
        </>
    )
}