'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DynModal from './DynModal';
import Form from './Form';
import { Button } from './Button';
import Link from 'next/link';
import { Hand } from 'lucide-react';
import Intro from './Intro';

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


      <div className="signature relative  h-full w-full flex items-center justify-end px-12">
        <div className='flex flex-col text-black text-3xl '>
          <p className='text-black'>Eirik Hammer</p>
          <Link href={"mailto:example@email.com"} target='_blank'>example@email.com</Link>
          <p>10 + Years experience, studied and educated at Strykejernet, Oslo</p>
          <div className="ten flex gap-2">


            <span className=' bg-blue-400 text-white rounded-full p-2 text-xs  w-20 flex items-center justify-center'>Tufting </span>
            <span className=' bg-orange-400 text-white rounded-full p-2 text-xs  w-20 flex items-center justify-center'>Mixed media </span>
            <span className=' bg-purple-400 text-white rounded-full p-2 text-xs  w-20 flex items-center justify-center'>Handmade </span>

          </div>
        </div>
      </div>


    </section>
  );
};

export default Hero;
