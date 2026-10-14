import { addColors, config } from "winston";

export const customLevels = {
  levels: {
    ...config.npm.levels,
    // eigene/überschriebene Levels hier, z.B.:
    // audit: 2,
  },
  colors: {
    ...config.npm.colors,
    http: "gray",
    // audit: "magenta",
  },
} as const;

export function registerLevelColors(): void {
  addColors(customLevels.colors);
}
