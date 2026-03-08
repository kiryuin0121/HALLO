"use client";

import { sequenceNumAtom, signUpAtom, signUpStepAtom } from "@/atoms/signUp";
import { useAtom } from "jotai";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { signUpSchema } from "@/schemas/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";

const InputAccount = () => {
  const [signUp, setSignUp] = useAtom(signUpAtom);
  const [signUpStep, setSignUpStep] = useAtom(signUpStepAtom);
  const [sequenceNum,setSequenceNum]=useAtom(sequenceNumAtom);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // エラーを配列で管理
  const [errors, setErrors] = useState<string[]>([]);

  // キャンパスに応じた初期メールアドレスの設定
  useEffect(() => {
    let initialEmail = "";

    switch (signUp.campus) {
      case "osaka":
        initialEmail = "ohs/**5ケタの学籍番号**/@ohs.hal.ac.jp";
        break;
      case "tokyo":
        initialEmail = "ots/**5ケタの学籍番号**/@ots.hal.ac.jp";
        break;
      case "nagoya":
        initialEmail = "ons/*5ケタの学籍番号**/@ons.hal.ac.jp";
        break;
      default:
        initialEmail = "example@email.com";
    }

    setEmail(initialEmail);
  }, [signUp.campus]);

  const handleDetermine = () => {
    const currentErrors: string[] = [];

    // 1. email の個別バリデーション
    const emailResult = signUpSchema.shape.email.safeParse(email);
    if (!emailResult.success) {
      currentErrors.push(emailResult.error.issues[0].message);
    }

    // 2. password の個別バリデーション
    const passwordResult = signUpSchema.shape.password.safeParse(password);
    if (!passwordResult.success) {
      currentErrors.push(passwordResult.error.issues[0].message);
    }

    // 3. パスワード一致チェック
    if (password !== confirmPassword) {
      currentErrors.push("パスワードが一致しません");
    }

    // エラーがある場合はセットして中断
    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      return;
    }

    // エラーがない場合はAtomを更新して次へ
    setErrors([]);
    setSignUp((prev) => ({
      ...prev,
      email: email,
      password: password,
    }));

    setSequenceNum(sn=>sn+1);
  };

  return (
    <div
      className={`h-screen w-screen flex justify-center items-center font-dotgothic`}
    >
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-2xl bg-black border-2 border-neutral-800 p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden pointer-events-auto`}
      >
        {/* Header */}
        <div className={`text-neutral-500 text-sm mb-8 break-all`}>
          <h2 className={`leading-relaxed`}>
            Q:\HALLO\SIGN_UP\{signUpStep.toUpperCase()}
            {">"}
            <span className={`text-neutral-200 ml-2`}>
              ログイン情報を設定してください
            </span>
          </h2>
        </div>

        {/* Input Form */}
        <div className={`flex-1 flex flex-col space-y-6 justify-center`}>
          {/* Email Field */}
          <div className={`flex flex-col`}>
            <label className={`text-neutral-500 text-[10px] mb-1`}>メールアドレス (学校/個人)</label>
            <div
              className={`flex items-center space-x-3 border-b border-neutral-800 focus-within:border-neutral-400 transition-colors`}
            >
              <span className={`text-neutral-600 text-sm`}>{">"}</span>
              <input
                type="email"
                className={`flex-1 bg-transparent outline-none text-neutral-50 py-1 placeholder:text-neutral-800`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.length > 0) setErrors([]);
                }}
                placeholder="example@hal.ac.jp"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className={`flex flex-col`}>
            <label className={`text-neutral-500 text-[10px] mb-1`}>
              パスワード
            </label>
            <div
              className={`flex items-center space-x-3 border-b border-neutral-800 focus-within:border-neutral-400 transition-colors`}
            >
              <span className={`text-neutral-600 text-sm`}>{">"}</span>
              <input
                type={showPassword ? "text" : "password"}
                className={`flex-1 bg-transparent outline-none text-neutral-50 py-1 placeholder:text-neutral-800`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.length > 0) setErrors([]);
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`cursor-pointer text-neutral-600 hover:text-neutral-300 transition-colors px-2`}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className={`flex flex-col`}>
            <label className={`text-neutral-500 text-[10px] mb-1`}>
              パスワード(確認用)
            </label>
            <div
              className={`flex items-center space-x-3 border-b border-neutral-800 focus-within:border-neutral-400 transition-colors`}
            >
              <span className={`text-neutral-600 text-sm`}>{">"}</span>
              <input
                type={showConfirm ? "text" : "password"}
                className={`flex-1 bg-transparent outline-none text-neutral-50 py-1 placeholder:text-neutral-800`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.length > 0) setErrors([]);
                }}
                placeholder="••••••••"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDetermine();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`cursor-pointer text-neutral-600 hover:text-neutral-300 transition-colors px-2`}
              >
                {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Message List */}
          <div className={`min-h-8 mt-2 space-y-1`}>
            {errors.map((msg, index) => (
              <p key={index} className={`text-red-500 text-xs`}>
                [!] VALIDATION_ERROR: {msg}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex justify-between items-end text-[10px] text-neutral-600 tracking-tighter`}
        >
          <div className={`flex items-center space-x-2`}>
            <span
              className={`inline-block w-2 h-2 ${errors.length > 0 ? "bg-yellow-500" : "bg-emerald-500"} rounded-full`}
            />
            <span>
              {errors.length > 0 ? "SYSTEM_INREADY" : "SYSTEM_READY"}:
              {errors.length > 0 ? "VALIDATION_ERROR" : "WAITING_FOR_USER_INPUT"}
            </span>
          </div>
          <div className={`text-right leading-none`}>
            <p className={`text-neutral-500 mb-1`}>Press [Enter] to Execute</p>
            <p className={`opacity-30 uppercase`}>HALLO_v1.2.1</p>
          </div>
        </div>

        {/* Scanline Effect */}
        <div
          className={`absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]`}
        ></div>
      </motion.section>
    </div>
  );
};

export default InputAccount;