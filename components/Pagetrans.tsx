import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const Pagetrans = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const router = useRouter();

  const handleRouteChangeStart = (url: string) => {
    if (url !== router.pathname) {
      setNextPath(url);
      setIsTransitioning(true);
    }
  };

  const handleRouteChangeComplete = () => {
    setTimeout(() => {
      setIsTransitioning(false);
      setNextPath(null);
    }, 500); // Adjust the delay (in milliseconds) as needed
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router]);



  const getDisplayText = (path: string | null) => {
    if (!path) return "";
    if (path === "/") return "Home";
    if (path.includes("/Projects/")) return "Project Details";
    if (path === "/Projects") return "Projects"
    if (path === "/Buy-art") return "Buy Art"
    if (path.includes("/Buy-art/")) return "Art Details";

    if (path === "/Contact") return "Contact"
    return path;
  };

  return (
    <AnimatePresence mode="wait">
      {isTransitioning && (
        <motion.div
          key="pagetransition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black text-white flex items-center justify-center z-[9999]"
        >
          <p className="text-5xl tracking-widest bg-zinc-200 p-1">Taking you to {getDisplayText(nextPath)} <span className="animate-pulse">...</span></p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Pagetrans;