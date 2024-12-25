import Lottie from "react-lottie";
import animationData from "./assets/elk.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: {
      ...animationData,
      layers: animationData.layers.map((layer) => {
        if (layer.ef) {
          layer.ef.forEach((effect) => {
            if (effect.mn === "ADBE Color Control" && effect.ef?.[0]) {
              effect.ef[0].v.k = [0, 0, 0, 0.6];
            }
            if (effect.mn === "ADBE Slider Control" && effect.ef?.[0]) {
              effect.ef[0].v.k = 12;
            }
          });
        }
        return layer;
      }),
    },
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex items-center justify-center">
      <Lottie options={defaultOptions} height={100} width={100} />
    </div>
  );
};

export default Loader;
