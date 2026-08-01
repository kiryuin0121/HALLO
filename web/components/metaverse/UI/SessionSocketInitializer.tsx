"use client";
import { useSession } from '@/lib/auth-client';
import { Session, User } from 'better-auth'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/env';
/* 
  「ログイン→メタバースに入室、ログアウト/ページを離脱→メタバースから退出」というシナリオを実現させるために、globalStateに以下2つを保持する。
  ・現在ログイン状態(ユーザーの情報を含む)
  ・現在のソケット接続の情報：WSサーバーが現在メタバースに入室しているユーザーを一意に識別できるよう、接続経路を1本に定める。(単一のsocket.ioインスタンスへの参照をGS突っ込んでアプリ全体で使いまわす。)
*/
type UserSession = {
  user:User;
  session:Session;
}
export const sessionAtom = atom<UserSession|null>(null);//セッション情報
export const socketAtom = atom<Socket|null>(null);//単一のsocket.ioインスタンス

const SessionSocketInitializer = ({children}:{children:React.ReactNode}) => {
  // GS更新用関数
  const setSession = useSetAtom(sessionAtom);
  const setSocket = useSetAtom(socketAtom);

  // セッション情報を取得する。
  const { data:userSession } = useSession();
  // セッションが存在すればGSで保持する。
  useEffect(() => {
      if(!userSession)return;
      setSession(userSession);
  }, [userSession]);

  // ログイン時(セッションが存在する）にWSサーバーとの間に1本だけ通信経路を確立し、GSで保持する。(経路があるならば、入室を意味する)
  useEffect(() => {
    if(!userSession)return;

    const userId = userSession.session.userId;
    const socket = io(SOCKET_URL,{auth:{token:userId}});
    setSocket(socket);
    // socket.connect();
    console.log("メタバースに入室しました。");

    // ログアウト/ページ離脱時には、WSサーバーとの通信経路を破棄する。(経路がないならば、退出を意味する)
    return () => {
      socket.disconnect();
      setSocket(null);
    }
  }, [userSession?.session.userId]);
  
  const socket = useAtomValue(socketAtom);
  // ログインしていない場合は、childrenの描画をブロックする。
  if(!userSession||!socket){
    return <div className={`w-screen h-screen flex justify-center items-center bg-black text-white text-lg font-dotgothic`}>Now Loading ...</div>
  }

  return (
    <>{children}</>
  )
}

export default SessionSocketInitializer