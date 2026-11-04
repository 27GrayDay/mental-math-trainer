let ctx: AudioContext | undefined;

export function playTone(correct: boolean) {
  try {
    ctx ??= new AudioContext();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.frequency.value = correct ? 880 : 220;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.12);
  } catch { /* звук недоступен */ }
}
