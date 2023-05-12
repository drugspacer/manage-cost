import React from "react";
import useImagePreload from "../../hooks/useImagePreload";
import Skeleton from "@mui/material/Skeleton";

const ImagePreload = ({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) => {
  const imageLoaded = useImagePreload(src, width, height);

  return (
    <>
      {imageLoaded ? (
        <img src={src} alt={alt} width={width} height={height} />
      ) : (
        <Skeleton variant="rectangular" width={width} height={height} />
      )}
    </>
  );
};

export default ImagePreload;
