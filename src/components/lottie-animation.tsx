import Lottie from "react-lottie";

type LottieAnimationProps = {
  lottie: any;
  width?: any;
  height?: any;
  title: string;
};

function LottieAnimation({ lottie, width, height, title }: LottieAnimationProps) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div>
      <Lottie options={defaultOptions} height={height} width={width} title={title} />
    </div>
  );
}

export default LottieAnimation;
