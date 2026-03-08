export const generateUserColor = (userId: string) => {
  // userIdをハッシュ化して色相(0-360)を生成
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);

  // 彩度と明度を固定して読みやすい色にする
  return `hsl(${hue}, 70%, 60%)`;
};
