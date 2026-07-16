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
    // Reset state on source change
    setLoaded(false);
    setError(false);

    // Dynamic browser cache preheating
    const img = new Image();
    img.src = src;
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-[#e8e4df]/60 ${className}`}>
      {/* Loading state shimmer */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full animate-pulse bg-gradient-to-r from-[#e8e4df] via-[#f0ece7] to-[#e8e4df]" />
        </div>
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f8f6f3] text-xs text-[#8a8a8a] font-mono">
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
