import { signUpAtom } from "@/atoms/signUp";
import { Campus, Gender, Major, MBTI } from "@/generated/prisma/enums";
import { useAtom } from "jotai";
import { LuPencil, LuPencilOff } from "react-icons/lu";

type Props = {
  label: string;
  key: "name"|"campus"|"major"|"grade"|"gender"|"mbti"|"bio"|"avatarConfig"|"email"|"password";
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormItem = ({
  label,
  key,
  isEdit,
  setIsEdit,
}: Props) => {
  const [signUp, setSignUp] = useAtom(signUpAtom);
  const value = signUp[key];
  return (
    <div className="space-y-1">
      <div className="text-white/40 text-xs">{label}</div>

      {isEdit ? (
        <div className="relative " >
          <input
            type="text"
            name={key as string}
            defaultValue={value as string}
            className="bg-transparent border-b border-white/40 outline-none"
            onChange={(e) =>
              setSignUp((s) => ({
                ...s,
                [key]: e.target.value,
              }))
            }
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2"
            onClick={() => setIsEdit(false)}
          >
            <LuPencil />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="text-white/90">{ value ?? "-"}</div>
          <input type="hidden" name={key as string} value={value as string} />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2"
            onClick={() => setIsEdit(true)}
          >
            <LuPencilOff />
          </button>
        </div>
      )}
    </div>
  );
};
export default FormItem;
