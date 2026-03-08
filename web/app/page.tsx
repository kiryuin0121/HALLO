"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import TopScene from "@/components/top/3D/TopScene";
import TopUI from "@/components/top/UI/TopUI";
import { Leva } from "leva";
import Loading from "@/components/global/UI/Loading";


const TopPage = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="relative w-screen h-screen text-neutral-50 overflow-hidden">
      {/* 背景画像 */}

      <div className="absolute inset-0 -z-10 bg-[url(/images/bg.gif)] bg-no-repeat bg-cover bg-center brightness-[0.5]" />
      {/* 3D */}
      <Canvas className="absolute inset-0">
        <Suspense fallback={null}>
          <TopScene onLoaded={() => setLoaded(true)} />
        </Suspense>
      </Canvas>

      {/* UI */}
      {loaded ? (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <TopUI />
        </div>
      ) : (
        <Loading />
      )}

      <Leva hidden />
    </main>
  );
};

export default TopPage;
