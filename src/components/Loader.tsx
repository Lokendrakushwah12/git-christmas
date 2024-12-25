import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

import animationData from "./assets/elk.json";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

const Loader = () => {
  const [modifiedAnimationData, setModifiedAnimationData] =
    useState(animationData);

  useEffect(() => {
    const updatedAnimationData = JSON.parse(JSON.stringify(animationData));

    if (updatedAnimationData && updatedAnimationData.layers) {
      updatedAnimationData.layers.forEach((layer: any) => {
        if (layer.shapes) {
          layer.shapes.forEach((shape: any) => {
            if (shape.it) {
              shape.it.forEach((item: any) => {
                if (item.ty === "st") {
                  item.c.k = [1, 1, 1, 0.6];
                  item.w.k = 10;
                }
              });
            }
          });
        }
      });
    }

    setModifiedAnimationData(updatedAnimationData);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: modifiedAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="pointer-events-none flex items-center justify-center">
      {modifiedAnimationData && (
        <Lottie options={defaultOptions} height={100} width={100} />
      )}
    </div>
  );
};

export default Loader;
