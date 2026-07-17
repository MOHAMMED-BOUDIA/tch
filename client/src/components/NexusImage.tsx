import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface NexusImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function NexusImage({ src, alt, className = "" }: NexusImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  if (!src) return null;

  return (
    <div className={`relative overflow-hidden bg-[#1E293B]/60 ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full animate-pulse bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B]" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A] text-xs text-[#94A3B8] font-mono">
          [Image Error]
        </div>
      )}

      {/* Optimized standard image tag with ref policy */}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
}
