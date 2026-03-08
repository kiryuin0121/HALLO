"use client";
import { modalAtom } from "@/components//metaverse/UI/Modal";
import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

export type Settings = {
  bgm: {
    enable: boolean;
    volume: number;
  };
  voice:{
    enable:boolean;
    volume:number;
  }
};

export const settingsAtom = atom<Settings | null>(null);

const BGM_SRC = "/sounds/night-light.mp3";

const SettingsManager = () => {
  const [settings, setSettings] = useAtom(settingsAtom);
  const setModalContent = useSetAtom(modalAtom);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. 初回: localStorageから設定を読み込む
  useEffect(() => {
    const rawSetting = localStorage.getItem("settings");
    
    if (!rawSetting) {
      setModalContent("confirm"); // 設定なし → モーダル表示
    } else {
      setSettings(JSON.parse(rawSetting)); // 設定あり → 適用
    }
  }, []);

  // 2. Audio要素を1回だけ作成
  useEffect(() => {
    const audio = new Audio(BGM_SRC);
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // 3. settingsが変更されたらBGMを再生/停止
  useEffect(() => {
    if (!audioRef.current || !settings) return;

    const audio = audioRef.current;
    audio.volume = settings.bgm.volume;

    if (settings.bgm.enable) {
      audio.play().catch(() => {
        // 自動再生失敗 → キー入力で再生
        const handleInput = () => {
          audio.play();
          document.removeEventListener('keydown', handleInput);
        };
        document.addEventListener('keydown', handleInput, { once: true });
      });
    } else {
      audio.pause();
    }

    console.log("settingManager",settings);
    // localStorageに保存
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return null;
};

export default SettingsManager;