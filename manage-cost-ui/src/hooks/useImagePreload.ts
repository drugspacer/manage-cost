import { useEffect, useState } from "react";

const useImagePreload = (src: string, width?: number, height?: number) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image(width, height);
    img.src = src;
    const handleLoad = () => setImageLoaded(true);
    img.addEventListener("load", handleLoad);
    return () => img.removeEventListener("load", handleLoad);
  }, [src]);

  return imageLoaded;
};

export default useImagePreload;
