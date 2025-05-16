import { perspective, slideIn } from '@/anim';
import { footerLinks, links } from '@/public/data';
import { AnimatePresence, motion } from 'framer-motion';
import { Instagram, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { userHasBrowser } from "@/lib/userHasBrowser";


type NavProps = {


};

const menu = {
  open: {
    width: "inherit",
    height: "650px",
    top: "-25px",
    right: "-50px",

    transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] }
  },
  closed: {
    width: "100px",
    height: "40px",
    top: "0px",
    right: "0px",
    transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1] }
  }
}

export default function Nav({ }: NavProps): JSX.Element {

  const [isActive, setIsActive] = useState(false);
  const [activeLink, setActiveLink] = useState<number | null>(0);
  const [isMobile, setIsMobile] = useState(false);
  const hasBrowser = userHasBrowser();
  const handleLinkClick = (index: number) => {
    setActiveLink(index); // Set the clicked link as active

  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <header>
      <nav>
        <motion.div className="flex flex-col justify-between items-center  h-fit box-border w-full lg:w-fit   fixed z-[9999] "
        >
          <AnimatePresence mode='sync'>
            <motion.div className="flex gap-5 flex-row justify-start items-start  w-3/4 lg:w-full mr-auto   p-3 rounded-b-md"
              variants={menu}>
              {links.map((link, i) => {
                const { title, href } = link;
                return (
                  <motion.div key={`b_${i}`} className="[perspective:120px] [perspective-origin:bottom]"
                    custom={i}
                    variants={perspective}
                    initial="initial"
                    animate="enter"
                    exit="exit">
                    <Link
                      href={href}
                      onClick={() => handleLinkClick(i)}
                      className={`p-3 h-fit flex flex-col  ${activeLink === i ? "text-white" : "opacity-65 text-black"}`}
                    >
                      {activeLink === i && (
                        <div className="absolute inset-0 z-0">
                          <Image
                            src="/buttonbg.png"
                            alt="Button background"
                            fill
                            className="object-cover rounded-md" // Make sure the image covers the entire button
                          />
                        </div>
                      )}
                      <motion.span variants={slideIn} className={`relative z-10  text-xl lg:text-[46px] font-bold no-underline   transition-all duration-75 ease-in-out   ${activeLink === i ? "" : "opacity-65 text-black"}`}>{title}</motion.span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </nav>

    </header>
  );
}
