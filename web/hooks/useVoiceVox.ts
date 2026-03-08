// useVoiceVox.ts
import { useAtomValue } from "jotai";
import { settingsAtom } from "@/components//metaverse/UI/SettingsManager";
import { useEffect, useRef } from "react";
import { profileAtom } from "@/components/metaverse/UI/ProfilePage";

export const useVoiceVox = () => {
  const settings = useAtomValue(settingsAtom);
  const settingsRef = useRef(settings);

  const isProfilePage = useAtomValue(profileAtom);
  const isProfilePageRef = useRef(isProfilePage); 

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    isProfilePageRef.current = isProfilePage;
  }, [isProfilePage]);

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const pronounce = async (
    text: string,
    speaker: number,
    speed: number = 1,
  ) => {
    if (!audioRef.current) return;

    const speakSpeed = speed * (speaker === 17 ? 1.3 : 1);

    const res = await fetch("/api/voicevox", {
      method: "POST",
      body: JSON.stringify({ text, speaker, speed: speakSpeed }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const voiceEnabled =
      settingsRef.current === null || settingsRef.current.voice.enable;
    if (!voiceEnabled) return;


    if (isProfilePageRef.current !== null) return;

    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.src = url;
    audio.volume = settingsRef.current?.voice.volume ?? 1;
    await audio.play();
  };

  return pronounce;
};