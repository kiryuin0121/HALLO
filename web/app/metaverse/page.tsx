import Metaverse from "@/components/metaverse/3D/Metaverse"
import UI from "@/components/metaverse/UI/MetaverseUI"

// app/world/page.tsx
const MetaversePage = () => {
  return (
    <main className={`w-screen h-screen overflow-hidden text-neutral-50 relative`}>
      {/* 背景画像 */}
      <div
        className="absolute inset-0 -z-10 bg-[url(/images/bg.gif)] bg-no-repeat bg-cover bg-center brightness-[0.5]"
      />
      {/* ボタンなど */}
      <UI/>
      {/* 3d空間*/}
      <Metaverse/>
    </main>
  )
}

export default MetaversePage