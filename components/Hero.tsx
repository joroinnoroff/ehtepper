'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DynModal from './DynModal';
import Form from './Form';
import { Button } from './Button';
import Link from 'next/link';
import { Hand, Mail, Play } from 'lucide-react';
import Intro from './Intro';
import { VideoBanner } from './VideoBanner';
import InfBanner from './InfBanner';

const venues = [
  "The Stenersen Museum",
  "Takfag",
  "Henie Onstad Art Center",
  "The Royal Norwegian National Theatre",
  "Monkey Town New York",
  "LNM",
  "The Astrup Fearnley Museum",
  "LIAF  Lofoten International Art Festival",
  "Preus Museum",
];

const Hero = () => {
  const [selectedLang, setSelectedLang] = useState<string>('EN');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleModal = () => setIsModalOpen(prev => !prev);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className=" w-screen h-[330vw] lg:h-[80vw]  top-[-50vh] lg:top-20 min-h-screen max-w-6xl mx-auto rounded right-0 left-0 overflow-hidden opacity-85">


      <div className="signature relative  h-full w-full flex items-center justify-between px-2 lg:px-12 gap-2 lg:gap-10">


        <div className="video flex flex-col w-full">
          <div className="videoplayin ">
            <VideoBanner />
          </div>
        </div>
        <div className='flex flex-col text-black text-xs lg:text-3xl w-full  lg:w-4/6 xl:w-5/12'>

          <Link href={"mailto:example@email.com"} target='_blank' className='border rounded-full w-fit lg:w-80 justify-center px-4 py-4 flex items-center gap-2 bg-orange-300 hover:text-zinc-50 text-black transition-all hover:bg-orange-400'>Get in touch <Mail strokeWidth={1.25} /></Link>
          <span className='text-3xl font-light my-4 text-balance w-full lg:w-3/4 xl:w-full'>10 + Years experience, studied and educated at Strykejernet, Oslo</span>
          <div className="my-4 ov">

            <InfBanner />

          </div>
        </div>
      </div>


    </section>
  );
};

export default Hero;
