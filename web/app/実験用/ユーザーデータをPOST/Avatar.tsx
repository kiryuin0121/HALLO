import { signUpAtom } from "@/atoms/signUp";
import { PartsCategory } from "@/generated/prisma/enums";
import { AvatarConfig, AvatarConfigValue } from "@/types/avatar";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useAtomValue } from "jotai";
import React, { Suspense, useEffect, useRef } from "react";
import { Group, Skeleton } from "three";
import Parts from "./Parts";

const Avatar = (props: any) => {
  //Avatar本体への参照をrefで保持
  const group = useRef<Group>(null!); 

  //Avatar本体のnodesを取得する。(ボーン＋メッシュ情報)
  const { nodes } = useGLTF("/models/Armature.glb"); 

  //グローバルステートにJSON文字列として保持してあるアバター情報を解析する。(「STEP3：アバターを設定」しようで設定)
  const signUp = useAtomValue(signUpAtom);
  const avatarConfig = JSON.parse(signUp.avatarConfig); 

  // Avatarにアニメーションを適用させる。
  const { animations } = useFBX("/models/Idle.fbx");
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions["mixamo.com"]?.play(); //Idleアニメーションを再生
  }, []);

  // 未定義領域へのアクセスを防止する。
  if (!avatarConfig) {
    console.log("avatarConfigが設定されていません。");
    return null;
  }
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          {/* アニメーション用のスケルトンを配置*/}
          <primitive object={nodes.mixamorigHips} />

          {/* avatarConfigのカテゴリ名(key)に紐づくオブジェクト(value)にpartsが設定されていれば、Avatar本体に装着する。 */}
          {(Object.keys(avatarConfig) as PartsCategory[]).map((categoryName) => {
            const avatarConfigValue = avatarConfig[categoryName];
            const parts = avatarConfigValue?.parts;
            const isRender = !!(parts && parts.model);
            return isRender ? (
              <Suspense key={parts.id}>
                <Parts
                  categoryName={categoryName}
                  model={parts.model}
                  avatarSkeleton={(nodes.Plane as any).skeleton as Skeleton} //漢はanyで黙らせるッッ!!!
                />
              </Suspense>
            ) : null;
          })}
        </group>
      </group>
    </group>
  );
};

export default Avatar;

  // console.log(signUp);
  /* 
  avatarConfig
: 
"{\"head\":{\"parts\":{\"id\":\"52341647-7dd7-4e36-b9b2-a70c88763f33\",\"name\":\"head01\",\"image\":\"/models/parts/head01.png\",\"model\":\"/models/parts/Head.001.glb\",\"createdAt\":\"2026-01-26T14:50:19.136Z\",\"updatedAt\":\"2026-01-26T14:50:19.136Z\",\"categoryId\":\"356cb675-c39c-44b4-8ad9-db0571bfa10c\"},\"color\":\"#FFDFC4\"},\"hair\":{\"parts\":{\"id\":\"4f25cb10-3d6a-4564-9a86-0bfee204845a\",\"name\":\"hair04\",\"image\":\"/models/parts/hair04.png\",\"model\":\"/models/parts/Hair.004.glb\",\"createdAt\":\"2026-01-26T14:50:19.136Z\",\"updatedAt\":\"2026-01-26T14:50:19.136Z\",\"categoryId\":\"fc720cf8-f9bc-4b2c-93da-db8afd2360b4\"},\"color\":\"#E91E63\"},\"face\":{\"parts\":null,\"color\":\"#262626\"},\"eyes\":{\"parts\":{\"id\":\"cf546987-5caa-4c6b-bdfd-0436778175a4\",\"name\":\"eyes10\",\"image\":\"/models/parts/eyes10.png\",\"model\":\"/models/parts/Eyes.010.glb\",\"createdAt\":\"2026-01-26T14:50:19.136Z\",\"updatedAt\":\"2026-01-26T14:50:19.136Z\",\"categoryId\":\"d4f5da3a-b957-4012-a5ba-5915679762a7\"},\"color\":null},\"eyebrows\":{\"parts\":null,\"color\":\"#262626\"},\"nose\":{\"parts\":{\"id\":\"b792c913-89f3-44e0-88b0-966b2079a1cc\",\"name\":\"nose04\",\"image\":\"/models/parts/nose04.png\",\"model\":\"/models/parts/Nose.004.glb\",\"createdAt\":\"2026-01-26T14:50:19.136Z\",\"updatedAt\":\"2026-01-26T14:50:19.136Z\",\"categoryId\":\"44d3a79f-7568-4cbd-876f-86e8474c73fe\"},\"color\":null},\"facial_hair\":{\"parts\":null,\"color\":\"#262626\"},\"glasses\":{\"parts\":null,\"color\":\"#C27D0E\"},\"hat\":{\"parts\":{\"id\":\"38328104-b20f-4132-8fcf-3bb057d99212\",\"name\":\"hat01\",\"image\":\"/models/parts/hat01.png\",\"model\":\"/models/parts/Hat.001.glb\",\"createdAt\":\"2026-01-26T14:50:19.136Z\",\"updatedAt\":\"2026-01-26T14:50:19.136Z\",\"categoryId\":\"ccd8b00c-483a-4d4e-ae9f-63ced638f1ba\"},\"color\":\"#262626\"},\"top\":{\"parts\":{\"id\":\"defd4e60-1e3a-4241-b496-be7ae8a95077\",\"name\":\"top01\",\"image\":\"/models/parts/top01.png\",\"model\":\"/models/parts/Top.001.glb\",\"createdAt\":\"2026-01-26T14:50:19.136Z\",\"updatedAt\":\"2026-01-26T14:50:19.136Z\",\"categoryId\":\"62d003b7-1174-4caa-8e3a-8b6718173956\"},\"color\":\"#330033\"},\"bottom\":{\"parts\":{\"id\":\"78c60bc1-5314-47d8-8537-b8d215bd7fc9\",\"name\":\"bottom01\",\"image\":\"/models/parts/bottom01.png\",\"model\":\"/models/parts/Bottom.001.glb\",\"createdAt\":\"2026-01-26T14:50:19.136Z\",\"updatedAt\":\"2026-01-26T14:50:19.136Z\",\"categoryId\":\"31373f53-4ee0-4b0a-8c66-55a3c6c8ced6\"},\"color\":\"#330033\"},\"shoes\":{\"parts\":{\"id\":\"df62f753-d0b0-4217-9d3c-2a4de4990951\",\"name\":\"shoes03\",\"image\":\"/models/parts/shoes03.png\",\"model\":\"/models/parts/Shoes.003.glb\",\"createdAt\":\"2026-01-26T14:50:19.136Z\",\"updatedAt\":\"2026-01-26T14:50:19.136Z\",\"categoryId\":\"8901497e-290c-4efe-af68-6a40e89b4fa0\"},\"color\":\"#330033\"},\"accessories\":{\"parts\":{\"id\":\"918040dc-eef0-49bd-bcdf-d539bd73fd84\",\"name\":\"accessories01\",\"image\":\"/models/parts/accessories01.png\",\"model\":\"/models/parts/Earring.001.glb\",\"createdAt\":\"2026-01-26T14:50:19.136Z\",\"updatedAt\":\"2026-01-26T14:50:19.136Z\",\"categoryId\":\"a75e7a9e-f8f3-4852-92bb-e7913a7bc230\"},\"color\":null}}"
bio
: 
""
campus
: 
"osaka"
email
: 
"ohs50348@ohs.hal.ac.jp"
gender
: 
"male"
grade
: 
1
major
: 
"it_web_ai"
mbti
: 
"INTJ"
name
: 
"KILL"
password
: 
"password123"
  */
