import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Props { }

const Tilt: React.FC<Props> = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const defaultSettings = {
    reverse: false,
    max: 35,
    perspective: 1000,
    easing: "cubic-bezier(.03,.98,.52,.99)",
    scale: 1.1,
    transitionSpeed: 1000,
    axis: null as "x" | "y" | null,
    reset: true,
  };

  const reverse = defaultSettings.reverse ? -1 : 1;

  const updateElementPosition = () => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };
    }
    return { width: 0, height: 0, left: 0, top: 0 };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { width, height, left, top } = updateElementPosition();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const tiltX = (reverse * (defaultSettings.max / 2 - x * defaultSettings.max)).toFixed(2);
    const tiltY = (reverse * (y * defaultSettings.max - defaultSettings.max / 2)).toFixed(2);

    setStyle({
      transform: `perspective(${defaultSettings.perspective}px) rotateX(${defaultSettings.axis === "x" ? 0 : tiltY}deg) rotateY(${defaultSettings.axis === "y" ? 0 : tiltX}deg) scale(${defaultSettings.scale})`,
      transition: `transform ${defaultSettings.transitionSpeed}ms ${defaultSettings.easing}`,
    });
  };

  const handleMouseLeave = () => {
    if (defaultSettings.reset) {
      setStyle({
        transform: `perspective(${defaultSettings.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
        transition: `transform ${defaultSettings.transitionSpeed}ms ${defaultSettings.easing}`,
      });
    }
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const newPerspective = defaultSettings.perspective + scrollY / 2;
    const newRotation = scrollY / 10;

    setStyle({
      transform: `perspective(${newPerspective}px) rotateX(${newRotation}deg) rotateY(${newRotation}deg) scale(${defaultSettings.scale})`,
      transition: `transform ${defaultSettings.transitionSpeed}ms ${defaultSettings.easing}`,
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);




  return (
    <div
      ref={elementRef}
      className=" cursor-pointer hover:rotate-12 transition-all overflow-hidden"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-[250px] h-[250px] lg:w-[400px] md:h-[200px] lg:h-[400px] xl:h-[430px]">
        <Image src="/hypnagogia.png" fill alt="Dynamic Image" className="object-contain" />
      </div>
    </div>
  );
};

export default Tilt;
