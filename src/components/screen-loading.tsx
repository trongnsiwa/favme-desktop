import React from "react";
import { useStore } from "src/store/store";
import favmeLogo from "@public/favme-white-text-logo.png";
import Image from "next/image";

function ScreenLoading() {
  const loading = useStore((state) => state.screenLoading);

  return loading ? (
    <div className="h-screen w-screen fixed bg-black/80 z-50 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <div className="w-1/4 mx-auto">
          <Image src={favmeLogo} alt="Favme" objectFit="fill" />
        </div>
        <div className="spinner mt-3"></div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ScreenLoading;
