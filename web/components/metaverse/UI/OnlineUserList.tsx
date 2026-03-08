// OnlineUserList.tsx
"use client";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { profileAtom } from "./ProfilePage";
import { modalAtom } from "./Modal";
import { otherPlayersAtom, selfAtom } from "../3D/Players";
import { LiveIcon } from "@/components/global/UI/Icons";

const OnlineUserList = () => {
  const self = useAtomValue(selfAtom);
  const otherPlayers = useAtomValue(otherPlayersAtom);
  const setProfile = useSetAtom(profileAtom);
  const [modalContent, setModalContent] = useAtom(modalAtom);
  return (
    <div className="absolute top-8 left-8 w-1/5 aspect-2/1 bg-black/40 text-neutral-300 rounded-xl border border-neutral-600 p-4 space-y-2 pointer-events-auto font-dotgothic">
      <div
        className={`text-sm flex justify-start items-center gap-x-1 text-green-400`}
      >
        {/* <span className={`animate-pulse`}>
        </span> */}
        <LiveIcon size={14} />
        参加者({otherPlayers.length + 1})
      </div>
      <ul className="text-xs space-y-2 overflow-hidden">
        <li>
          <button
            className={`hover:text-neutral-200 cursor-pointer`}
            onClick={() => {
              modalContent && setModalContent(null);
              setProfile(self?.id || "");
            }}
          >
            {self?.name}
          </button>
        </li>
        {otherPlayers.map((player) => (
          <li key={player.id}>
            <button
              onClick={() => {
                modalContent && setModalContent(null);
                setProfile(player.id);
              }}
              className="cursor-pointer hover:text-neutral-200"
            >
              {player.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUserList;
