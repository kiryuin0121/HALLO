"use client";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { useAtomValue, useSetAtom } from "jotai";

import { profileAtom } from "./ProfilePage";
import { modalAtom } from "./Modal";
import {
  UserWithProfile,
  CampusLabel,
  MajorLabel,
  GenderLabel,
  MBTILabel,
} from "@/types/profile";
import { otherPlayersAtom, selfAtom } from "../3D/Players";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UserList = () => {
  // ユーザー一覧を取得する。
  const { data: users, isLoading } = useSWR<UserWithProfile[]>(
    `/api/users/`,
    fetcher
  );
  const self = useAtomValue(selfAtom); //自分
  const myId = self?.id;
  const otherPlayers = useAtomValue(otherPlayersAtom); //他のオンラインユーザー

  const [query, setQuery] = useState("");//検索文字列
  const setProfile = useSetAtom(profileAtom);
  const setModalContent = useSetAtom(modalAtom);

  // オンラインユーザーのidリスト(値を重複させたくないのでSetで管理する)
  const onlineIds = useMemo(() => {
    // 他人のみのオンラインリストに自分を追加する。
    const ids = new Set(otherPlayers.map((p) => p.id));
    if (self) ids.add(self.id);
    return ids;
  }, [otherPlayers, self]);

  // 表示するユーザー
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const trimedQuery = query.trim().toLowerCase();

    const filtered = !trimedQuery ? users : users.filter((u) => {
      const p = u.profile;
      if (!p) return u.name.toLowerCase().includes(trimedQuery);

      const searchTargets = [
        u.name,
        p.campus,
        CampusLabel[p.campus],
        p.major,
        MajorLabel[p.major],
        String(p.grade),
        p.gender,
        GenderLabel[p.gender],
        p.mbti,
        MBTILabel[p.mbti],
        p.hometown ?? "",
        p.bio ?? "",
      ];

      return searchTargets.some((t) => t.toLowerCase().includes(trimedQuery));
    });

    return filtered.sort((a, b) => {
      const aOnline = onlineIds.has(a.id) || a.id === myId ? 1 : 0;
      const bOnline = onlineIds.has(b.id) || b.id === myId ? 1 : 0;
      return bOnline - aOnline;
    });
  }, [users, query, onlineIds, myId]);


  const handleUserClick = (userId: string) => {
    setModalContent(null);
    setProfile(userId);
  };

  return (
    <div className="space-y-4">
      {/* 検索バー */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="名前・学校・学部・出身地"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-indigo-400 focus:bg-white/15 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* 件数表示 */}
      {!isLoading && users && (
        <div className="text-xs text-white/40">
          {filteredUsers.length} / {users.length} 件
        </div>
      )}

      {/* ユーザー一覧 */}
      {isLoading ? (
        <div className="text-center text-white/40 py-8 text-sm">
          ユーザー情報を取得しています...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-white/40 py-8 text-sm">
          ユーザーが見つかりませんでした
        </div>
      ) : (
        <ul className="space-y-1">
          {filteredUsers.map((user) => {
            const isOnline = onlineIds.has(user.id);
            return (
              <li key={user.id}>
                <button
                  onClick={() => handleUserClick(user.id)}
                  className="w-full flex items-center gap-x-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left group"
                >
                  {/* アイコン + オンライン/オフラインバッジ */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center text-white/60 text-sm font-bold select-none">
                      {user.name.charAt(0)}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-neutral-900 ${
                        isOnline ? "bg-green-400" : "bg-neutral-500"
                      }`}
                    />
                  </div>

                  {/* 名前 + 在籍校 */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                      {user.name}
                    </span>
                    {user.profile && (
                      <span className="text-xs text-white/40 truncate">
                        {CampusLabel[user.profile.campus]}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserList;