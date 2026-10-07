import tailwindcss from "@tailwindcss/vite";
export default {
  framework: "@storybook/html-vite",
  stories: ["../src/**/*.stories.tsx"],
  viteFinal: (config) => ({ ...config, plugins: [...(config.plugins ?? []), tailwindcss()] }),
};
