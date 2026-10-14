import type { StorybookConfig } from "@storybook/html-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const storybookConfig: StorybookConfig = {
  framework: "@storybook/html-vite",
  stories: ["../src/**/*.stories.ts"],
  logLevel: 'debug',
  staticDirs: ["../../../apps/web/public"],
  viteFinal: (viteConfig, { configType }) =>
    mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      // configType === "DEVELOPMENT" | "PRODUCTION"
    }
  ),
  addons: ["msw-storybook-addon"],
};
export default storybookConfig;
