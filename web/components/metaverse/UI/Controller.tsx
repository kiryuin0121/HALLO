"use client";
import { useAtom } from "jotai";
import { settingsAtom } from "@/components//metaverse/UI/SettingsManager";
import { MdRecordVoiceOver, MdVoiceOverOff } from "react-icons/md";
import { FaMicrophone,FaMicrophoneSlash } from "react-icons/fa";
import { MicIcon, MicOffIcon } from "@/components/global/UI/Icons";
const Controller = () => {
  const [settings, SetSettings] = useAtom(settingsAtom);
  const toggleVoice = () => {
    if (!settings) return;
    const newSettings = {
      ...settings,
      voice: {
        ...settings.voice,
        enable: !settings.voice.enable,
      },
    };
    SetSettings(newSettings);
  };
  return (
    <button
      className={`${settings?.voice.enable?"text-neutral-400":"text-neutral-400"} hover:text-neutral-200 transition-colors cursor-pointer`}
      onClick={toggleVoice}
    >
      {settings?.voice.enable ? (
        // <FaMicrophone className="size-5" />
        <MicIcon size={22}/>
      ) : (
        // <FaMicrophoneSlash className="size-5" />
        <MicOffIcon size={22}/>
      )}
    </button>
  );
};

export default Controller;
