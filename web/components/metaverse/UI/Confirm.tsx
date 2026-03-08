"use client";
import { useSetAtom } from "jotai";
import { modalAtom } from "./Modal";
import { settingsAtom } from "@/components//metaverse/UI/SettingsManager";

const Confirm = () => {
  const setModalContent = useSetAtom(modalAtom);
  const setSettings = useSetAtom(settingsAtom);

  const handle = (enable: boolean) => {
    const newSettings = {
      bgm: { enable, volume: 0.3 },
      voice: { enable: false, volume: 0.5 },
    };
    setSettings(newSettings);
    setModalContent(null);
  };

  return (
    <div className="font-dotgothic space-y-8 text-center">
      <div className="text-xl tracking-widest">BGMを有効にしますか？</div>
      <div className="flex justify-center gap-8">
        <button
          onClick={() => handle(true)}
          className={`cursor-pointer tracking-wider px-8 py-3 font-bold  bg-indigo-500/20 hover:bg-indigo-500/30 
            text-indigo-400 rounded-lg transition-colors duration-200
            border border-indigo-500/50`}
        >
          する！
        </button>
        <button
          onClick={() => handle(false)}
          className={`cursor-pointer tracking-wider px-8 py-3 font-bold  bg-gray-500/20 hover:bg-gray-500/30 
            text-gray-400 rounded-lg transition-colors duration-200
            border border-gray-500/50`}
        >
          しないかな...
        </button>
      </div>
    </div>
  );
};

export default Confirm;
