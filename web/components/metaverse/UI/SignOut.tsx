import { useSetAtom } from "jotai";
import { modalAtom } from "./Modal";
import { signOut } from "@/lib/auth-client";


const SignOut = () => {
  const setModalContent = useSetAtom(modalAtom);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="font-dotgothic space-y-8 text-center">
      <div className="text-xl tracking-widest">
        メタバースから退出してもよろしいですか？
      </div>
      <div className="flex justify-center gap-8">
        <button
          onClick={handleSignOut}
          className={`cursor-pointer px-8 py-3 font-bold  bg-red-500/20 hover:bg-red-500/30 
            text-red-400 rounded-lg transition-colors duration-200
            border border-red-500/50`}
        >
          退出する
        </button>
        <button
          onClick={() => setModalContent(null)}
          className={`cursor-pointer px-8 py-3 font-bold  bg-gray-500/20 hover:bg-gray-500/30 
            text-gray-400 rounded-lg transition-colors duration-200
            border border-gray-500/50`}
        >
          考え直す
        </button>
      </div>
    </div>
  );
};

export default SignOut;