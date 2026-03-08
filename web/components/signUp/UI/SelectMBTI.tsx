"use client";

import { useAtom, useSetAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import "swiper/css";

import { sequenceNumAtom, signUpAtom} from "@/atoms/signUp";

import { signUpSchema } from "@/schemas/auth";

const ITEMS_PER_SLIDE = 4;
const COLS = 2;

const mbtiOptions = [
  { mbti: "ISTJ", label: "ISTJ 管理者", image: "/images/mbti/istj.png", description: "実用的で事実に基づき、極めて誠実。" },
  { mbti: "ISFJ", label: "ISFJ 擁護者", image: "/images/mbti/isfj.png", description: "非常に献身的で、温かい心の保護者。" },
  { mbti: "ESTJ", label: "ESTJ 幹部", image: "/images/mbti/estj.png", description: "物事や人々を管理する、優れた実務家。" },
  { mbti: "ESFJ", label: "ESFJ 領事", image: "/images/mbti/esfj.png", description: "思いやり深く、社交的で人気がある。" },
  { mbti: "INFJ", label: "INFJ 提唱者", image: "/images/mbti/infj.png", description: "静かだが理想主義で、周囲を鼓舞する。" },
  { mbti: "INFP", label: "INFP 仲介者", image: "/images/mbti/infp.png", description: "詩的で親切、常に利他的な理想主義者。" },
  { mbti: "ENFP", label: "ENFP 広報運動家", image: "/images/mbti/enfp.png", description: "情熱的で独創的、自由な精神の持ち主。" },
  { mbti: "ENFJ", label: "ENFJ 主人公", image: "/images/mbti/enfj.png", description: "カリスマ性があり、人々を魅了する。" },
  { mbti: "INTJ", label: "INTJ 建築家", image: "/images/mbti/intj.png", description: "想像力豊かで、戦略的な思考の持ち主。" },
  { mbti: "INTP", label: "INTP 論理学者", image: "/images/mbti/intp.png", description: "貪欲な知識欲を持つ、革新的な発明家。" },
  { mbti: "ENTJ", label: "ENTJ 指揮官", image: "/images/mbti/entj.png", description: "大胆で想像力豊か、強い意志の指導者。" },
  { mbti: "ENTP", label: "ENTP 討論者", image: "/images/mbti/entp.png", description: "賢くて好奇心旺盛、知的な挑戦を好む。" },
  { mbti: "ISTP", label: "ISTP 巨匠", image: "/images/mbti/istp.png", description: "大胆で実践的、あらゆる道具を使いこなす。" },
  { mbti: "ISFP", label: "ISFP 冒険家", image: "/images/mbti/isfp.png", description: "柔軟で魅力的、常に新しいことを探求。" },
  { mbti: "ESTP", label: "ESTP 起業家", image: "/images/mbti/estp.png", description: "賢く精力的、リスクを恐れず今を楽しむ。" },
  { mbti: "ESFP", label: "ESFP エンターテイナー", image: "/images/mbti/esfp.png", description: "陽気で衝動的、人生を退屈させない。" },
];
const SelectMBTI = () => {
  const [signUp, setSignUp] = useAtom(signUpAtom);
  const setSequenceNumAtom = useSetAtom(sequenceNumAtom);

  const swiperRef = useRef<SwiperCore | null>(null);

  const slides = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < mbtiOptions.length; i += ITEMS_PER_SLIDE) {
      chunks.push(mbtiOptions.slice(i, i + ITEMS_PER_SLIDE));
    }
    return chunks;
  }, []);

  const [cursor, setCursor] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDetermine = () => {
    const slideIndex = swiperRef.current?.activeIndex ?? 0;
    const flatIndex = slideIndex * ITEMS_PER_SLIDE + cursor;
    const selected = mbtiOptions[flatIndex];

    const result = signUpSchema.shape.mbti.safeParse(selected.mbti);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    setSignUp((prev) => ({ ...prev, mbti: result.data }));
    setSequenceNumAtom((prev) => prev + 1);
  
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const swiper = swiperRef.current;
      if (!swiper) return;

      if (e.code === "ArrowRight") {
        if (cursor % COLS === COLS - 1) swiper.slideNext();
        else setCursor((prev) => prev + 1);
      }
      if (e.code === "ArrowLeft") {
        if (cursor % COLS === 0) swiper.slidePrev();
        else setCursor((prev) => prev - 1);
      }
      if (e.code === "ArrowDown") {
        const next = cursor + COLS;
        if (next < ITEMS_PER_SLIDE) setCursor(next);
      }
      if (e.code === "ArrowUp") {
        const prev = cursor - COLS;
        if (prev >= 0) setCursor(prev);
      }
      if (e.code === "Enter") handleDetermine();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cursor]);

  return (
    <div className="h-screen w-screen flex justify-center items-center font-dotgothic">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-2/3 aspect-video bg-black border-2 border-neutral-800 p-8 flex flex-col gap-y-4 shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden pointer-events-auto"
      >
        {/* Question */}
        <div className="shrink-0 space-y-2">
          <h2 className="leading-relaxed text-neutral-500 text-sm break-all">
            Q:\HALLO\SIGN_UP\PERSONAL\MBTI{">"}
            <span className="text-neutral-200 ml-2">性格タイプを教えてください</span>
          </h2>
          <div className="text-neutral-500 text-sm whitespace-nowrap">
            A:\HALLO\{signUp.name ? signUp.name : "GUEST"}{">"}
          </div>
        </div>

        {/* Options */}
        <div className="flex-1 min-h-0 flex flex-col">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={1}
            allowTouchMove={false}
            className="w-full h-full flex-1"
          >
            {slides.map((slide, slideIdx) => (
              <SwiperSlide key={slideIdx} className="h-full!">
                <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
                  {slide.map((item, idx) => {
                    const isActive = idx === cursor;
                    return (
                      <div
                        key={item.mbti}
                        onMouseEnter={() => setCursor(idx)}
                        className={`flex flex-col items-center justify-center border  p-4 transition-all duration-150 ${
                          isActive ? "border-2 border-neutral-400" : "border-neutral-800"
                        }`}
                      >
                        <img src={item.image} alt={item.label} className="w-16 aspect-auto mb-2" />
                        <div className={`text-xs mb-1 ${isActive ? "text-neutral-100" : "text-neutral-700"}`}>
                          {item.label}
                        </div>
                        <div className={`text-[10px] text-center leading-tight ${isActive ? "text-neutral-300" : "text-neutral-600"}`}>
                          {item.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="h-8 mt-2 shrink-0">
            {error && (
              <p className="text-red-500 text-xs">[!] VALIDATION_ERROR: {error}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex justify-between items-end text-[10px] text-neutral-600 tracking-tighter">
          <div className="flex items-center space-x-2">
            <span className={`inline-block w-2 h-2 ${error ? "bg-yellow-500" : "bg-emerald-500"} rounded-full`} />
            <span>{error ? "SYSTEM_INREADY: VALIDATION_ERROR" : "SYSTEM_READY: WAITING_FOR_USER_SELECTION"}</span>
          </div>
          <div className="text-right leading-none">
            <p className="text-neutral-500 mb-1">Use [← → ↑ ↓] to Navigate / Press [Enter] to Execute</p>
            <p className="opacity-70 uppercase">HALLO_v.1.2.1</p>
          </div>
        </div>

        {/* CRT */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />
      </motion.section>
    </div>
  );
};

export default SelectMBTI;