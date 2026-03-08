"use client";

import { saveAllAction } from "@/lib/actions/profile";
import {
  CampusValues,
  MBTIValues,
  GenderValues,
  MajorValues,
} from "@/types/prisma";
import {
  CampusLabel,
  GenderLabel,
  MajorLabel,
  MBTILabel,
} from "@/types/profile";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoShirtOutline } from "react-icons/io5";
import { LiaUserEditSolid } from "react-icons/lia";
import ColorPicker from "./ColorPicker";
import PartsBox from "./PartsBox";
import {
  avatarConfigAtom,
  editStateAtom,
  myProfileAtom,
  updateMyProfileFieldAtom,
} from "@/atoms/myProfile";
import { selfAtom } from "../3D/Players";

// オーバーレイ
const CRTOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-size-[100%_3px]" />
);

// JSONコンポーネント
const JsonRow = ({
  label,
  isStr = true,
  children,
}: {
  label: string;
  isStr?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex items-baseline gap-x-1.5 font-mono text-[13px] leading-[1.9]">
    <span className="text-sky-500 text-[11px] shrink-0 w-20 text-right">
      {label}
    </span>
    <span className="text-neutral-600 shrink-0">:</span>
    {isStr && <span className="text-amber-400/50 shrink-0">"</span>}
    <span className={isStr ? "text-amber-100" : "text-violet-300"}>
      {children}
    </span>
    {isStr && <span className="text-amber-400/50 shrink-0">"</span>}
    <span className="text-neutral-700 shrink-0">,</span>
  </div>
);

const EditableInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-transparent outline-none text-amber-100 border-b border-dashed border-amber-300/40 focus:border-amber-200 min-w-20 max-w-40 font-mono text-[13px] transition-colors"
  />
);

const EditableSelect = ({
  value,
  options,
  onChange,
  isStr = true,
}: {
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (v: string) => void;
  isStr?: boolean;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`bg-transparent outline-none cursor-pointer border-b border-dashed border-amber-300/40 focus:border-amber-200 font-mono text-[13px] transition-colors ${isStr ? "text-amber-100" : "text-violet-300"}`}
  >
    {options.map((o) => (
      <option
        className="bg-neutral-900 text-white"
        key={o.value}
        value={o.value}
      >
        {o.label}
      </option>
    ))}
  </select>
);

const MyProfileUI = () => {
  const [editState, setEditState] = useAtom(editStateAtom); //プロフィール編集中か否か
  const myProfile = useAtomValue(myProfileAtom);
  const avatarConfig = useAtomValue(avatarConfigAtom);
  const updateField = useSetAtom(updateMyProfileFieldAtom);
  const setSelf = useSetAtom(selfAtom);

  const boundSaveAllAction = saveAllAction.bind(null, avatarConfig);

  const [actionState, formAction, isPending] = useActionState(
    boundSaveAllAction,
    { success: false, error: "" },
  );

  // プロフィールを更新後、編集状態を解除する。
  useEffect(() => {
    if (actionState.success) setEditState(null);
  }, [actionState.success]);

  const isEditing = editState !== null;
  const isProfileEdit = editState === "profile";
  const isAvatarEdit = editState === "avatar";

  return (
    <div className="w-screen h-screen absolute z-21 overflow-hidden pointer-events-none">
      {/* フォーム(非表示) */}
      <form action={formAction} id="save-form">
        <input type="hidden" name="name" value={myProfile.name} />
        <input type="hidden" name="campus" value={myProfile.campus} />
        <input type="hidden" name="major" value={myProfile.major} />
        <input type="hidden" name="grade" value={myProfile.grade} />
        <input type="hidden" name="gender" value={myProfile.gender} />
        <input type="hidden" name="mbti" value={myProfile.mbti} />
        <input type="hidden" name="bio" value={myProfile.bio} />
        <input type="hidden" name="voice" value={myProfile.voice} />
        <input type="hidden" name="hometown" value={myProfile.hometown} />
      </form>

      {/* 影 */}
      <AnimatePresence>
        {!isAvatarEdit && (
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* 全体のグラデーション */}
            <div className="absolute inset-y-0 left-0 w-[52%] bg-linear-to-r from-black via-black/80 to-transparent" />
            {/* 上下のグラデーション */}
            <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent" />
            {/* 上下の区切り線 */}
            <div className="absolute top-16 inset-x-0 h-px bg-neutral-800/40" />
            <div className="absolute bottom-16 inset-x-0 h-px bg-neutral-800/40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ヘッダー */}
      <header className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-10 pointer-events-none">
        {/* プロフィールを閉じる */}
        <AnimatePresence>
          {!isAvatarEdit && (
            <motion.span
              key="path"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[10px] text-neutral-600 tracking-[0.3em]"
            >
              {/* C:\HALLO\USER\PROFILE */}
            </motion.span>
          )}
        </AnimatePresence>

        {/* 編集ボタンリスト */}
        <ul className="flex items-center gap-x-2 pointer-events-auto ml-auto">
          {/* プロフィール編集 */}
          <li>
            <button
              type="button"
              onClick={() => setEditState(isProfileEdit ? null : "profile")}
              className={`cursor-pointer border px-3 py-1.5 flex items-center gap-x-1.5 transition-all duration-200 font-mono text-[10px] tracking-widest
              ${
                isProfileEdit
                  ? "border-amber-400/50 text-amber-300 bg-amber-400/5"
                  : "border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"
              }`}
            >
              <LiaUserEditSolid size={12} />
              EDIT
              {isProfileEdit && (
                <span className="w-1 aspect-square rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          </li>

          {/* アバター編集ボタン */}
          <li>
            <button
              type="button"
              onClick={() => setEditState(isAvatarEdit ? null : "avatar")}
              className={`cursor-pointer border px-3 py-1.5 flex items-center gap-x-1.5 transition-all duration-200 font-mono text-[10px] tracking-widest
              ${
                isAvatarEdit
                  ? "border-sky-400/50 text-sky-300 bg-sky-400/5"
                  : "border-neutral-700 text-neutral-500 hover:border-neutral-500 hover:text-neutral-300"
              }`}
            >
              <IoShirtOutline size={12} />
              AVATAR
              {isAvatarEdit && (
                <span className="w-1 aspect-square rounded-full bg-sky-400 animate-pulse" />
              )}
            </button>
          </li>

          {/* 編集内容確定ボタン */}
          <AnimatePresence>
            {isEditing && (
              <motion.button
                key="save"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.15 }}
                type="submit"
                form="save-form"
                disabled={isPending}
                className="cursor-pointer border border-white/30 text-white px-4 py-1.5 font-mono text-[10px] tracking-widest hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-30"
              >
                {isPending ? "SAVING..." : "[ SAVE ]"}
              </motion.button>
            )}
          </AnimatePresence>
        </ul>
      </header>

      {/* プロフィールUI */}
      <AnimatePresence>
        {!isAvatarEdit && (
          <>
            <motion.div
              key="left-panel"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-[10%] top-16 bottom-16 w-fit flex flex-col justify-center px-10 gap-y-6 pointer-events-auto overflow-y-auto no-scrollbar"
            >
              {/* 名前 */}
              <div>
                <div className="font-mono text-[9px] text-neutral-600 tracking-[0.35em] mb-2">
                  PROFILE
                </div>

                {/* 名前 */}
                {isProfileEdit ? (
                  <input
                    type="text"
                    value={myProfile.name}
                    onChange={(e) => updateField({ name: e.target.value })}
                    className="bg-transparent outline-none text-white text-[36px] font-bold tracking-wide border-b border-dashed border-white/30 focus:border-white/60 transition-colors w-full leading-none pb-1"
                  />
                ) : (
                  <div className="text-white text-[36px] font-bold tracking-wide leading-none">
                    {myProfile.name}
                  </div>
                )}
                <div className="mt-2.5 font-mono text-[11px] text-neutral-500 tracking-widest flex items-center gap-x-2">
                  <span className="w-1 aspect-square rounded-full bg-emerald-500" />
                  STATUS_ONLINE
                </div>
              </div>

              {/* JSON エディタ */}
              <div className="relative bg-black/70 border border-neutral-800 backdrop-blur-sm overflow-hidden">
                {/* タブバー */}
                <div className="flex items-center border-b border-neutral-800">
                  <div className="px-4 py-2 border-r border-neutral-800 bg-neutral-900/50 flex items-center gap-x-2">
                    <span className="font-mono text-[10px] text-neutral-400">
                      <span className={`text-amber-400 font-bold`}>{"{}"}</span> profile.json
                    </span>
                    {isProfileEdit && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </div>
                  <div className="px-3 py-2 ml-auto">
                    <span className="font-mono text-[10px] text-neutral-700">
                      UTF-8
                    </span>
                  </div>
                </div>

                {/* JSONコンテンツ */}
                <div className="flex gap-x-3 px-4 py-4">
                  {/* 行番号 */}
                  <div className="flex flex-col items-end select-none shrink-0">
                    {Array.from({ length: 13 }).map((_, i) => (
                      <span
                        key={i}
                        className="font-mono text-[11px] text-neutral-700 leading-[1.9]"
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>

                  {/* コード本体 */}
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[13px] text-neutral-500 leading-[1.9]">
                      {"{"}
                    </div>

                    <div className="font-mono text-[11px] text-neutral-700 leading-[1.9] pl-8">
                      {"// 基本情報"}
                    </div>
                    <JsonRow label="name">
                      {isProfileEdit ? (
                        <EditableInput
                          value={myProfile.name}
                          onChange={(v) => updateField({ name: v })}
                        />
                      ) : (
                        myProfile.name
                      )}
                    </JsonRow>

                    <JsonRow label="hometown">
                      {isProfileEdit ? (
                        <EditableInput
                          value={myProfile.hometown}
                          onChange={(v) => updateField({ hometown: v })}
                        />
                      ) : (
                        myProfile.hometown || "—"
                      )}
                    </JsonRow>

                    <JsonRow label="gender">
                      {isProfileEdit ? (
                        <EditableSelect
                          value={myProfile.gender}
                          options={GenderValues.map((g) => ({
                            value: g,
                            label: GenderLabel[g],
                          }))}
                          onChange={(v) =>
                            updateField({
                              gender: v as typeof myProfile.gender,
                            })
                          }
                        />
                      ) : (
                        GenderLabel[myProfile.gender]
                      )}
                    </JsonRow>

                    <JsonRow label="mbti">
                      {isProfileEdit ? (
                        <EditableSelect
                          value={myProfile.mbti}
                          options={MBTIValues.map((m) => ({
                            value: m,
                            label: MBTILabel[m],
                          }))}
                          onChange={(v) =>
                            updateField({ mbti: v as typeof myProfile.mbti })
                          }
                        />
                      ) : (
                        MBTILabel[myProfile.mbti]
                      )}
                    </JsonRow>

                    <div className="font-mono text-[11px] text-neutral-700 leading-[1.9] pl-8">
                      {"// 学校情報"}
                    </div>

                    <JsonRow label="campus">
                      {isProfileEdit ? (
                        <EditableSelect
                          value={myProfile.campus}
                          options={CampusValues.map((c) => ({
                            value: c,
                            label: CampusLabel[c],
                          }))}
                          onChange={(v) =>
                            updateField({
                              campus: v as typeof myProfile.campus,
                            })
                          }
                        />
                      ) : (
                        CampusLabel[myProfile.campus]
                      )}
                    </JsonRow>

                    <JsonRow label="major">
                      {isProfileEdit ? (
                        <EditableSelect
                          value={myProfile.major}
                          options={MajorValues.map((m) => ({
                            value: m,
                            label: MajorLabel[m],
                          }))}
                          onChange={(v) =>
                            updateField({ major: v as typeof myProfile.major })
                          }
                        />
                      ) : (
                        MajorLabel[myProfile.major]
                      )}
                    </JsonRow>

                    <JsonRow label="grade" isStr={false}>
                      {isProfileEdit ? (
                        <EditableSelect
                          value={myProfile.grade}
                          options={[1, 2, 3, 4].map((g) => ({
                            value: g,
                            label: String(g),
                          }))}
                          onChange={(v) => updateField({ grade: Number(v) })}
                          isStr={false}
                        />
                      ) : (
                        myProfile.grade
                      )}
                    </JsonRow>

                    <div className="font-mono text-[13px] text-neutral-500 leading-[1.9]">
                      {"}"}
                    </div>
                  </div>
                </div>

                {actionState.error && (
                  <div className="px-4 pb-3 font-mono text-[10px] text-red-400">
                    // Error: {actionState.error}
                  </div>
                )}

                {/* ステータスバー */}
                <div className="border-t border-neutral-800 px-4 py-1.5 flex items-center justify-between bg-neutral-900/30">
                  <div className="flex items-center gap-x-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isProfileEdit ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`}
                    />
                    <span className="font-mono text-[9px] text-neutral-600 tracking-widest">
                      {isProfileEdit ? "UNSAVED CHANGES" : "SAVED"}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-neutral-700">
                    {"{}"}JSON
                  </span>
                </div>

                <CRTOverlay />
              </div>

              {/* bio */}
              {myProfile.bio && (
                <div className="font-mono text-[11px] text-neutral-500 leading-relaxed border-l-2 border-neutral-700 pl-3">
                  <span className="text-neutral-700">// </span>
                  {myProfile.bio}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* アバター編集UI */}
      <AnimatePresence>
        {isAvatarEdit && (
          <motion.div
            key="avatar-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 left-20 flex flex-col pointer-events-auto max-w-[90vw] overflow-x-scroll no-scrollbar"
          >
            <ColorPicker />
            <PartsBox />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isAvatarEdit && (
          <motion.footer
            key="bottom-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 inset-x-0 h-16 flex items-center justify-between px-10 pointer-events-none"
          >
            <span className="font-mono text-[10px] text-neutral-700 tracking-widest">
              {isEditing
                ? "[ SAVE ] to commit changes"
                : "[ EDIT ] profile  ·  [ AVATAR ] customize"}
            </span>
            <span className="font-mono text-[10px] text-neutral-700 tracking-widest">
              HALLO v1.2.1
            </span>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProfileUI;
