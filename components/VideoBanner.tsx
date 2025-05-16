import { Fullscreen, FullscreenIcon, Pause, Play } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';



export function VideoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setIsPaused(false);
      } else {
        videoElement.pause();
        setIsPaused(true);
      }
    }
  };



  useEffect(() => {
    const videoElement = videoRef.current;

    const handleFullscreenChange = () => {
      const isFullscreen =
        document.fullscreenElement === videoElement ||
        (document as any).webkitFullscreenElement === videoElement;
      if (videoElement) {
        if (isFullscreen) {
          videoElement.classList.add('fullscreen');
          videoElement.muted = false;
          videoElement.style.zIndex = '50';
        } else {
          videoElement.classList.remove('fullscreen');
          videoElement.muted = true;
          videoElement.style.zIndex = 'auto';
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div
      className={` 
      relative w-full p-1 h-[calc(50vh--100px)] xl:h-[calc(100vh-235px)] sm:w-3/4 lg:w-3/5 mx-auto my-80
        
        }`}
    >
      <video
        ref={videoRef}
        className={`w-full h-3/5 object-cover place-content-center 
          }`}
        width="1280"
        height="720"
        preload="true"
        autoPlay={true}
        playsInline={true}
        loop
        muted
      >
        <source src="/monica.mp4" type="video/mp4" />
        <track
          src="/monica.mp4"
          kind="subtitles"
          srcLang="en"
          label="English"
        />
        Your browser does not support the video tag.
      </video>
      <Link href={"https://www.youtube.com/watch?v=CKEdLJ-f0oc&ab_channel=%C3%85seKarlsen"} target='_blank' className='tracking-wide text-lg opacity-90 hover:text-zinc-700 transition-all'>F15 Performance - 19.01.2008</Link>

      <div className="absolute bottom-5 right-5 flex items-center gap-3">
        <button
          onClick={togglePlayPause}
          className="bg-black text-white p-2 rounded-md shadow-md transition-all"
        >
          {isPaused ? <Play /> : <Pause />}
        </button>

      </div>
    </div>
  );
}
