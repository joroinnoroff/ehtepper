'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DynModal from './DynModal';
import Form from './Form';
import { Button } from './Button';
import Link from 'next/link';
import { Hand, Play } from 'lucide-react';
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


      <div className="signature relative  h-full w-full flex items-center justify-between px-2 lg:px-12 gap-2 lg:gap-10">


        <div className="video flex flex-col">
          <div className="videoplaying h-[300px] lg:h-[500px] w-[150px] lg:w-[250px] rounded-md bg-zinc-300">
            <div className="play p-2">
              <Play />
            </div>
          </div>
        </div>
        <div className='flex flex-col text-black text-xs lg:text-3xl '>
          <p className='text-black'>Eirik Hammer</p>
          <Link href={"mailto:example@email.com"} target='_blank'>example@email.com</Link>
          <p>10 + Years experience, studied and educated at Strykejernet, Oslo</p>
          <div className="lg:flexten hidden gap-2">


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
