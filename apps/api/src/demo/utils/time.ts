export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;

  return `${pad(minutes)}:${pad(seconds)}.${pad3(millis)}`;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function pad3(n: number) {
  return n.toString().padStart(3, "0");
}
