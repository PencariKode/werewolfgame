'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { frijole } from '@/app/ui/fonts';

const listLink = {
    Beranda: "/",
    Buat: "/create",
    Tentang: "/tentang",
    Akun: "/register",
}

export default function Header() {
    const thisUrl = usePathname();
    const [isFixed, setIsFixed] = useState(false);

    const toggleFixed = () => {
        setIsFixed(!isFixed);
    };

    useEffect(() => {
        if (isFixed) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingTop = '9vh';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingTop = '0';
        }
    }, [isFixed]);
    

    const [isMobile, setIsMobile] = useState(false); // Initialize with false

    useEffect(() => {
        setIsMobile(window.innerWidth < 640);
        const handleResize = () => {
            setIsMobile(() => window.innerWidth < 640);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize) ;
    }, []);

    return (
        /*
        [text-shadow:0_0_4px_whitesmoke;] 
        */
        <header className={`mincomp h-[9vh] sm:h-[10vh] bg-dark-primary flex sm:fixed top-0 left-0 w-full z-[100] ${isFixed ? 'fixed' : ''} border-solid border-b-2 ${isFixed && isMobile ? ' border-dark-text' : 'border-transparent'}`}>
            <section itemID="formobile" className="mincomp flex sm:hidden justify-center items-center max-w-full relative">
                <Link href="/" className={` ${frijole.className} max-w-full w-fit min-w-fit  hover:[text-shadow:0_0_4px_red;] flex justify-center items-center uppercase font-extrabold text-4xl xs:text-2xl`}>W<i className="fa-brands fa-wolf-pack-battalion"></i>LFMAN</Link>
                <button onClick={toggleFixed} className="  absolute right-5 top-0 flex items-center justify-center min-h-full max-w-full font-bold text-3xl"><i className="fa-solid fa-bars"></i></button>
            </section>

            <aside id='navbarmobile' className={`mincomp overflow-x-hidden sm:invisible overflow-y-auto min-h-screen h-screen fixed top-[9vh] z-[99] duration-300 *:duration-300 ${isFixed && isMobile ? 'navMobActive' : 'navMobNonActive'}`}>
                <div onClick={toggleFixed} className='fixed top-[9vh mincomp min-h-full h-full max-h-full overflow-hidden z-[90]'></div>
                <section className='min-h-full h-full w-[65%] xs:w-[50%] max-w-[65%] bg-dark-primary absolute right-0 top-0 z-[93]'>
                    <nav className='flex flex-col gap-2 pt-5 min-h-full h-full min-w-full max-w-full w-full bg-white bg-opacity-5 items-start relative'>
                        {Object.keys(listLink).map((key) => (
                            <Link key={key} href={listLink[key]} onClick={toggleFixed} className={` bg-dark-bg bg-opacity-70 h-11 font-bold min-w-full flex items-center link-underline link-underline-black py-1 px-3 relative left-5 rounded-l-md hover:scale-[.98] hover:!font-semibold ${thisUrl === listLink[key] ? 'navSideActive' : ''}`}><span className='link-underline link-undeline-black'>{key}</span></Link>
                        ))}
                    </nav>
                </section>
            </aside>

            <section itemID="fordesktop" className="mincomp hidden sm:flex justify-between items-center max-w-full px-10 md:px-24 lg:px-32 ">
                <Link href="/" className={` ${frijole.className} flex justify-center items-center uppercase font-extrabold text-[1.7rem] xl:text-3xl hover:[text-shadow:0_0_10px_red;]`}>W<i className="fa-brands fa-wolf-pack-battalion"></i>LFMAN</Link>
                <nav className="flex gap-4 min-w-10 max-w-[70%] min-h-4 max-h-full text-lg xl:text-lg font-semibold">
                    {Object.keys(listLink).map((key) => (
                        <Link key={key} href={listLink[key]} className={`flex link-underline link-underline-black justify-center items-center min-w-2 min-h-5 py-1 max-h-fu</section>ll rounded-md px-3 ${thisUrl === listLink[key] ? 'navPcActive' : 'navPcNonActive'}`}><span>{key}</span></Link>
                    ))}
                </nav>
            </section>
        </header>
    );
}

