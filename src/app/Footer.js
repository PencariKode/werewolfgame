import { frijole } from "@/app/ui/fonts";

import Link from 'next/link';

const listLink = [
    [
        [
            { nama: "Tentang", link: "/tentang" },
            { nama: "Akun", link: "/register" },
            { nama: "Kontak", link: "/kontak" },
            { nama: "FAQ", link: "/faq" },
        ], [
            { nama: "Bantuan", link: "/bantuan" },
            { nama: "Kontribusi", link: "/kontribusi" },
            { nama: "Syarat & Ketentuan", link: "/snk" },
            { nama: "Kebijakan Privasi", link: "/privasi" },
        ]
    ], [
        [
            { nama: "Panduan", link: "/panduan" },
            { nama: "Kritik & Saran", link: "/kritik" },
            { nama: "Laporan Bug", link: "/bug" },
            { nama: "Donasi", link: "/donasi" },
        ],
    ]
];

export default function Footer() {


    return (
        <footer className="overflow-clip bg-dark-primary min-w-full !max-w-full min-h-[10] flex flex-col md:flex-row md:gap-10 md:pl-10 py-7 px-6 lg:pl-16">
            <section className="mincomp flex flex-col md:max-w-[35%] md:min-w-[35%] md:justify-center ">
                <Link href="/" className={`${frijole.className} text-3xl`}>WOLFMAN</Link>
                <p className="text-sm pl-1">© 2024 WOLFMAN. All rights reserved.</p>
                <p className="text-sm pt-1.5 pl-1">Made with <i className="fa-solid fa-heart"></i> By <Link href="//github.com/PencariKode" className="font-bold link-underline link-underline-black">Panji Depari</Link></p>
            </section>
            <section className="mincomp flex flex-col mt-10 md:max-w-[calc(65%-2.5rem)] md:min-w-[calc(65%-2.5rem)]">
                <div className="mincomp flex flex-col *:*:*:max-w-fit lg:flex-row gap-4 lg:gap-0">
                    {listLink.map((link, index) => (
                        <div key={index} className="mincomp flex flex-col xs:flex-row lg:min-w-[50%] lg:max-w-[50%] gap-4 lg:gap-0 ">
                            {link.map((item, index) => (
                                <div key={index} className="mincomp flex flex-col gap-1  xs:max-w-[50%] xs:min-w-[50%]">
                                    {item.map((subitem, index) => (
                                        <Link key={index} href={subitem.link} className="text-sm link-underline link-underline-black">{subitem.nama}</Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </footer>
    );

}