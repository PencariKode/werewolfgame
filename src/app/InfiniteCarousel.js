'use client';

import Image from "next/image";
import { useState, useEffect, use } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { EffectCoverflow, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

import { roles } from "@l/lib";


const configRoleColor = {
  'manusia': 'bg-cyan-700',
  'werewolf': 'bg-red-900',
}

const InfiniteCarousel = () => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const swiperInstance = document.querySelector('.swiper').swiper;
    if (swiperInstance) {
      swiperInstance.params.coverflowEffect.modifier = isMobile ? 1.5 : 3.5;
      swiperInstance.update();
    }
  }, [isMobile]);

  function handleSwiper(swiper) {
    swiper.on('slideChange', () => {
      const idx = swiper.realIndex;
      setActiveIndex(idx);
    });
  }

  function handleDescBtn(e) {
    let icon;

    if (e.target.tagName === 'BUTTON') icon = e.target.querySelector('i');
    else                               icon = e.target;
    
    if (icon.classList.contains('fa-caret-down')) {
      icon.classList.remove('fa-caret-down');
      icon.classList.add('fa-caret-up');
    } else {
      icon.classList.remove('fa-caret-up');
      icon.classList.add('fa-caret-down');
    }

    const fieldset = e.target.closest('fieldset');
    const paragraph = fieldset.querySelector('p');
    
    if (paragraph.classList.contains('line-clamp-1')) {
      paragraph.classList.remove('line-clamp-1');
      fieldset.classList.remove('max-h-24');
    } else {
      paragraph.classList.add('line-clamp-1');
      fieldset.classList.add('max-h-24');
    }
  }

  return (
    <div className="slide-container min-w-full max-w-full w-full min-h-3 h-screen mt-10 sm:px-10 lg:px-16 xl:px-20 2xl:px-28">
      <div className="invisible after:bg-cyan-700 after:bg-red-900"></div>
      <h1 className="text-xl sm:text-3xl font-bold  mincomp flex justify-center items-center text-center mb-10">Mainkan dengan 8 Roles tersedia</h1>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: -50,
          depth: 125,
          modifier: isMobile ? 1.5 : 3.5,
          slideShadows: false
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Navigation]}
        // onSlideChange={(e) => console.log('slide change', e)}
        onSwiper={handleSwiper}
        id="slider"
        className="!relative mb-0"
      >

        <div className=" slider-controler ">
          <button className="swiper-button-prev bg-rose-900 px-2 pt-1 rounded-md cursor-pointer hover:scale-95 "><i className="fa-solid fa-arrow-left"></i></button>
          <button className="swiper-button-next bg-rose-900 px-2 pt-1 rounded-md cursor-pointer hover:scale-95 "><i className="fa-solid fa-arrow-right"></i></button>
        </div>

        {roles.map((role, index) => {

          return (
            <SwiperSlide key={index} className={`max-w-32 sm:max-w-64 min-w-fit min-h-4 pb-10 mt-5 ${index === activeIndex ? '' : 'opacity-40'}`}>
              <div className={`min-w-32 max-w-full min-h-2 flex flex-col items-center justify-center after:${configRoleColor[role.side]} ${index === activeIndex ? 'after:rounded-full' : 'after:rounded-[3rem] sm:after:rounded-[4.5rem]'} after:[content:''] after:min-w-32 after:max-w-32 after:min-h-32 after:max-h-32 sm:after:min-w-56 sm:after:max-w-56 sm:after:min-h-56 sm:after:max-h-56 after:absolute after:-z-10 after:top-2 sm:after:top-12 `}>
                <Image src={role.image} priority={false} alt={role.name} width={isMobile ? 128 : 400} height={isMobile ? 128 : 400} className={` max-w-32 sm:max-w-64 min-w-fit max-h-32 min-h-fit !aspect-square ${index === activeIndex ? 'w-32 h-32 sm:w-64' : ' '}`} />
              </div>
            </SwiperSlide>
          );
        })}


      </Swiper>
      <div className="mincomp -mt-10 flex flex-col justify-center items-center gap-4 ">
        <h1 className={`text-xl sm:text-3xl font-bold min-w-fit w-fit max-w-fit px-3 py-1 rounded-md flex justify-center items-center text-center mt-10 ${configRoleColor[roles[activeIndex].side]}`}>{roles[activeIndex].name}</h1>
        <fieldset className=" bg-dark-primary min-w-[95%] max-w-[95%] xs:min-w-[85%] xs:max-w-[85%] md:min-w-[75%] md:max-w-[75%] lg:min-w-[65%] lg:max-w-[65%] xl:min-w-[50%] xl:max-w-[50%] 2xl:min-w-[40%] 2xl:max-w-[40%] min-h-5 max-h-24 h-fit rounded-md px-3 pb-2 pt-3 relative flex flex-col">
          <legend className="float-left text-lg sm:text-xl font-semibold mb-5">Deskripsi</legend>
          <button onClick={handleDescBtn} type="button" className="absolute right-3 top-3 text-3xl flex justify-center items-center bg-dark-secondary max-w-fit max-h-fit px-1.5 rounded-md hover:scale-95"><i className="fa-solid fa-caret-down"></i></button>
          <p className="text-sm sm:text-base text-justify max-w-full min-w-full min-h-3 line-clamp-1">{roles[activeIndex].desc}</p>
        </fieldset>
      </div>
    </div>
  );
};

export default InfiniteCarousel;
