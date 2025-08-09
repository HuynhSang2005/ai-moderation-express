import Lottie from "lottie-react";
import type { CSSProperties } from "react";

import animationData from "../../assets/success-check.json"; 

export default function SuccessLottie({ show }: { show: boolean }) {
  if (!show) return null;
  const style: CSSProperties = { width: 90, height: 90 };
  return <Lottie animationData={animationData} style={style} loop={false} />;
}
