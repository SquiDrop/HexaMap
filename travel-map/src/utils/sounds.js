const play = (src) => {
  try {
    new Audio(src).play();
  } catch (_) {}
};

export const playDeptUnlock  = () => play("/sounds/dept-unlock.mp3");
export const playBadgeUnlock = () => play("/sounds/badge-unlock.wav");
