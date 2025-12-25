"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { logoIconsList } from "@/constants";

const LogoShowcase = () => {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if animations already played this session
    const hasAnimated = sessionStorage.getItem("heroAnimated");

    if (hasAnimated) {
      // Skip animation, just show it
      gsap.set(containerRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Delay to sync with Hero animation sequence
    const timer = setTimeout(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }, 4000); // Appears after hero animations complete

    return () => clearTimeout(timer);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="relative -mt-[60vh] md:-mt-32 opacity-0 h-12 md:h-32" />
    );
  }

  return (
    <div ref={containerRef} className="relative -mt-[60vh] md:-mt-32 opacity-0">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="relative overflow-hidden rounded-lg">
          <div className="gradient-edge" />
          <div className="gradient-edge" />
          <div className="marquee h-12 md:h-32">
            <div className="marquee-box md:gap-12 gap-4">
              {logoIconsList.map((icon, index) => (
                <div
                  key={index}
                  className="flex-none flex items-center justify-center marquee-item scale-50 md:scale-100"
                >
                  <img src={icon.imgPath} alt={icon.name} />
                </div>
              ))}
              {logoIconsList.map((icon, index) => (
                <div
                  key={`dup-${index}`}
                  className="flex-none flex items-center justify-center marquee-item scale-50 md:scale-100"
                >
                  <img src={icon.imgPath} alt={icon.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;
