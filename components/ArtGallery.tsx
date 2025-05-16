import { WordpressPost } from "@/types/WordpressTypes";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ArtGallery = ({
  images,
  artTitles,
  posts,

}: {
  images: string[];
  artTitles: string[];
  posts: WordpressPost[];

}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isloading, setIsLoading] = useState(false);


  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formattedDate = (date: string | number | Date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }

  if (!images.length) {
    return <div className="text-center mt-10 flex flex-col md:flex-row gap-6 items-center justify-center px-1 lg:px-5 xl:px-10">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="w-full h-[300px] sm:h-[400px] bg-gray-200 rounded-md flex justify-center items-center animate-pulse">
          <div className="w-full h-[300px] sm:h-[350px] bg-zinc-300 animate-pulse rounded-lg"></div>
        </div>
      ))}

    </div>;
  }


  return (
    <section
      id="work"
      className="px-5  min-h-screen p-2 FONT2 my-2"

    >
      <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
        <AnimatePresence>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full cursor-pointer"
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
              hidden: { opacity: 0 },
            }}
          >
            {images.map((image, idx) => (
              <motion.div
                key={idx}
                className="relative w-full h-[300px] sm:h-[400px] cursor-pointer rounded-md overflow-hidden"
                onHoverStart={() => !isMobile && setHoveredIndex(idx)}
                onHoverEnd={() => !isMobile && setHoveredIndex(null)}
                variants={{
                  visible: { opacity: 1, x: 0 },
                  hidden: { opacity: 0, x: -20 },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/Projects/${posts[idx].id}`}>
                  <Image
                    draggable={false}
                    src={image || "/default-placeholder.jpg"}
                    alt={`Art ${idx + 1}`}
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                  <motion.div
                    className="absolute inset-0 z-10 bg-[#f01af8]"
                    initial={{ opacity: isMobile ? 0.6 : 0 }}
                    animate={{
                      opacity: isMobile || hoveredIndex === idx ? 0.6 : 0,
                    }}
                    transition={{ opacity: { duration: 0.3 } }}
                  />
                </Link>
                <motion.h2
                  className="absolute inset-0 flex hover:z-10 will-change-transform transition-all justify-center items-center opacity-0 text-white text-4xl font-bold uppercase tracking-widest text-center"
                  animate={{
                    opacity: isMobile || hoveredIndex === idx ? 1 : 0,
                  }}
                  transition={{ opacity: { duration: 0.3 } }}
                >
                  {artTitles[idx]}
                </motion.h2>
                <p className="relative z-10 text-white text-lg lg:text-xl p-3 tracking-widest">
                  {formattedDate(posts[idx]?.date)}
                </p>
              </motion.div>
            ))}

          </motion.div>

        </AnimatePresence>
      </MotionConfig>
    </section>
  );
};

export default ArtGallery;
