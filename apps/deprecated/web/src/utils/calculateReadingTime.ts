export function calculateReadingTime(text: string, difficulty: number = 1): number {
  return Math.round((text.split(' ').length / 200) * (difficulty / 10 + 1));
}
