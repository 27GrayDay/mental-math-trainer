type Sound = 'correct' | 'wrong';

/** Файлы лежат в public/sounds/. Если файла нет или он не запустился — играет короткий сигнал. */
const FILES: Record<Sound, string> = { correct: 'sounds/correct.wav', wrong: 'sounds/wrong.mp3' };
const clips: Partial<Record<Sound, HTMLAudioElement>> = {};
const clip = (kind: Sound) => (clips[kind] ??= new Audio(import.meta.env.BASE_URL + FILES[kind]));

let ctx: AudioContext | undefined;
function beep(correct: boolean) {
  try {
    ctx ??= new AudioContext();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.frequency.value = correct ? 880 : 220;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.12);
  } catch { /* звук недоступен */ }
}

export function playSound(kind: Sound) {
  try {
    const audio = clip(kind);
    audio.currentTime = 0;
    audio.play().catch(() => beep(kind === 'correct'));
  } catch { beep(kind === 'correct'); }
}

/**
 * На iOS и в части браузеров звук можно запускать только после действия пользователя.
 * Вызывается из кнопки «Начать» и «прогревает» оба файла, чтобы потом они играли и по таймеру.
 */
export function unlockSounds() {
  (['correct', 'wrong'] as Sound[]).forEach((kind) => {
    try {
      const audio = clip(kind);
      audio.muted = true;
      audio.play().then(() => { audio.pause(); audio.currentTime = 0; audio.muted = false; }).catch(() => { audio.muted = false; });
    } catch { /* нет поддержки */ }
  });
}
