"use client";
import { atom, useAtom } from "jotai";
import { IoIosSettings, IoMdClose } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import Settings from "./Settings";
import SignOut from "./SignOut";
import Confirm from "./Confirm";
import UserList from "./UserList";

export type ModalContent =
  | "users"
  | "settings"
  | "singOut"
  | "confirm"
  | null;

export const modalAtom = atom<ModalContent>(null);

const Modal = () => {
  const [modalContent, setModalContent] = useAtom<ModalContent>(modalAtom);

  if(!modalContent)return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 aspect-4/3 pointer-events-auto bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden">
      {/* ===== タブ無しビュー ===== */}
      {(modalContent === "singOut" || modalContent === "confirm") && (
        <div className="w-full h-full flex items-center justify-center relative">
          {/* 閉じるボタン */}
          <button
            onClick={() => setModalContent(null)}
            className={`${(modalContent === "singOut" || modalContent === "confirm") && "hidden"} absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10`}
          >
            <IoMdClose className="size-6 md:size-8" />
          </button>

          {modalContent === "singOut" && <SignOut />}
          {modalContent === "confirm" && <Confirm />}
        </div>
      )}

      {/* ===== タブ付きビュー ===== */}
      {(modalContent === "users" || modalContent === "settings") && (
        <>
          {/* Tabs */}
          <div className="w-full border-b border-neutral-500">
            <ul className="flex w-full relative">
              {(["users", "settings"] as ModalContent[]).map((mc) => (
                <li key={mc} className="flex-1">
                  <button
                    onClick={() => setModalContent(mc)}
                    className={`w-full flex justify-center items-center gap-x-2 py-4 cursor-pointer transition-colors
                      ${
                        modalContent === mc
                          ? "text-indigo-400"
                          : "text-gray-400 hover:text-gray-300"
                      }
                    `}
                  >
                    {mc === "users" && (
                      <>
                        <FaUsers className="size-[15px] md:size-[23px]" />
                        <span className="text-lg tracking-wider">
                          ユーザーを探す
                        </span>
                      </>
                    )}
                    {mc === "settings" && (
                      <>
                        <IoIosSettings className="size-[15px] md:size-[23px]" />
                        <span className="text-lg tracking-wider">設定</span>
                      </>
                    )}
                  </button>
                </li>
              ))}

              {/* 閉じるボタン */}
              <button
                onClick={() => setModalContent(null)}
                className={`
                  absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer p-4 text-gray-400 hover:text-white transition-colors z-10`}
              >
                <IoMdClose className="size-5 md:size-7" />
              </button>

              {/* 紫のバー */}
              <motion.div
                initial={{ x: modalContent === "users" ? "0%" : "100%" }}
                animate={{ x: modalContent === "users" ? "0%" : "100%" }}
                transition={{ duration: 0.3 }}
                className="absolute -bottom-0.5 h-1 w-1/2 bg-indigo-400 rounded-xl"
              />
            </ul>
          </div>

          {/* Content */}
          <div className="px-12 py-6 max-h-[calc(100%-60px)]  overflow-y-scroll no-scrollbar">
            {modalContent === "users" && <UserList />}
            {modalContent === "settings" && <Settings />}
          </div>
        </>
      )}
    </div>
  );
};

export default Modal;
