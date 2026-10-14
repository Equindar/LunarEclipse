/// <reference types="vite/client" />

import type { Preview } from "@storybook/html-vite";
import "../src/theme.css";

const preview: Preview = {
  // loaders: [addonMsw()],
  parameters: { layout: "centered" },
};
export default preview;
