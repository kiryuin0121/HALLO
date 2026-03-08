"use client";
import {Settings as UserSettings, settingsAtom } from "@/components//metaverse/UI/SettingsManager";
import { useAtom, useSetAtom } from "jotai";
import {AnimatePresence, motion} from "motion/react";
import { useEffect, useState } from "react";
import { modalAtom } from "./Modal";

const Settings = () => {
  const setModalContent = useSetAtom(modalAtom);
  const [settings, setSettings] = useAtom(settingsAtom);
  const [tempSettings, setTempSettings] = useState<UserSettings | null>(null);

  // 初回: 現在の設定を一時保存用にコピー
  useEffect(() => {
    if (settings) {
      setTempSettings(settings);
    }
  }, [settings]);

  if (!settings || !tempSettings) {
    return <div>読み込み中...</div>;
  }

  const toggleVoice = () => {
    const newSettings = {
      ...tempSettings,
      voice: {
        ...tempSettings.voice,
        enable: !tempSettings.voice.enable,
      },
    };
    setTempSettings(newSettings);
    setSettings(newSettings);
  };
  const toggleBgm = () => {
    const newSettings = {
      ...tempSettings,
      bgm: {
        ...tempSettings.bgm,
        enable: !tempSettings.bgm.enable,
      },
    };
    setTempSettings(newSettings);
    setSettings(newSettings);
  };

  const changeVoiceVolume = (volume: number) => {
    const newSettings = {
      ...tempSettings,
      voice: {
        ...tempSettings.voice,
        volume,
      },
    };
    setTempSettings(newSettings);
    setSettings(newSettings);
  };
  const changeBGMVolume = (volume: number) => {
    const newSettings = {
      ...tempSettings,
      bgm: {
        ...tempSettings.bgm,
        volume,
      },
    };
    setTempSettings(newSettings);
    setSettings(newSettings);
  };

  return (
    <div className="space-y-8">

      {/* ================= Voice ================= */}
     <div className="space-y-4">
        <div className="space-y-6">
          {/* BGM */}
          <div className="space-y-2">
            <span className="text text-white block">ボイス</span>
            <button
              onClick={toggleVoice}
              className={`relative cursor-pointer w-14 h-8 rounded-full transition-colors duration-300 ${
                tempSettings.voice.enable ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{
                  left: tempSettings.voice.enable ? "calc(100% - 28px)" : "4px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            </button>
          </div>

          <AnimatePresence>
            {tempSettings.voice.enable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden max-w-xs"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">ボリューム</span>
                  <span className="text-white font-bold">
                    {Math.round(tempSettings.voice.volume * 100)}%
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={tempSettings.voice.volume}
                    onChange={(e) => changeVoiceVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:shadow-lg
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-110
                      [&::-moz-range-thumb]:w-5
                      [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-white
                      [&::-moz-range-thumb]:border-0
                      [&::-moz-range-thumb]:shadow-lg
                      [&::-moz-range-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:transition-transform
                      [&::-moz-range-thumb]:hover:scale-110"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                        tempSettings.voice.volume * 100
                      }%, #374151 ${tempSettings.voice.volume * 100}%, #374151 100%)`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>🔈</span>
                  <span>🔊</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= BGM（既存そのまま） ================= */}
      <div className="space-y-4">
        <div className="space-y-6">
          {/* BGM */}
          <div className="space-y-2">
            <span className="text text-white block">BGM</span>
            <button
              onClick={toggleBgm}
              className={`relative cursor-pointer w-14 h-8 rounded-full transition-colors duration-300 ${
                tempSettings.bgm.enable ? "bg-green-500" : "bg-gray-600"
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{
                  left: tempSettings.bgm.enable ? "calc(100% - 28px)" : "4px",
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            </button>
          </div>

          <AnimatePresence>
            {tempSettings.bgm.enable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden max-w-xs"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">ボリューム</span>
                  <span className="text-white font-bold">
                    {Math.round(tempSettings.bgm.volume * 100)}%
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={tempSettings.bgm.volume}
                    onChange={(e) => changeBGMVolume(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:shadow-lg
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-110
                      [&::-moz-range-thumb]:w-5
                      [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-white
                      [&::-moz-range-thumb]:border-0
                      [&::-moz-range-thumb]:shadow-lg
                      [&::-moz-range-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:transition-transform
                      [&::-moz-range-thumb]:hover:scale-110"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                        tempSettings.bgm.volume * 100
                      }%, #374151 ${tempSettings.bgm.volume * 100}%, #374151 100%)`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>🔈</span>
                  <span>🔊</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-gray-700" />

      <div className="space-y-4">
        <h3 className="text-lg text-white">アカウント</h3>
        <button
          onClick={() => setModalContent("singOut")}
          className="cursor-pointer px-6 py-3 bg-red-500/20 hover:bg-red-500/30 
            text-red-400 rounded-lg transition-colors duration-200
            border border-red-500/50 font-medium"
        >
          メタバース空間から退出する
        </button>
      </div>
    </div>
  );
};

export default Settings;
