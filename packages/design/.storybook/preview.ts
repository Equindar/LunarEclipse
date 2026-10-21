/// <reference types="vite/client" />

import type { Preview } from "@storybook/html-vite";
import { themes } from "storybook/theming";
import "../src/index.css";
import "./preview.css";


const preview: Preview = {
  // loaders: [addonMsw()],
  tags: ['autodocs'],
  parameters: {
    layout: "centered",
    darkMode: {
      current: 'light',
      stylePreview: true,
      darkClass: "dark",
      lightClass: "light",
      classTarget: "html"
    },
    docs: {
      toc: true,
      theme: themes.dark,
      // page: DocsTemplate,
      source:  {
        excludeDecorators: true
      }
    },
  },
  globalTypes: {
    theme: {
      description: "Design-System Theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "classic", title: "Classic" },
          { value: "sunset", title: "Sunset" },
        ],
        dynamicTitle: true,
      },
    },

    colorMode: {
      description: "Color Mode",
      toolbar: {
        title: "Mode",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: "classic",
    colorMode: "light",
  },

  decorators: [
    (story, context) => {
    const { theme, colorMode } = context.globals;
    const dark = colorMode === "dark";
    const root = document.documentElement;

    if (context.viewMode !== "docs") {
      root.dataset.theme = theme;
      root.classList.toggle("dark", dark);
      return story();
    }

    // Docs: Seite neutral, Reste aus der Canvas-Ansicht entfernen
    delete root.dataset.theme;
    root.classList.remove("dark");

    const marker = document.createElement("div");
    marker.style.display = "contents";
    const result = story();
    if (typeof result === "string") marker.innerHTML = result;
    else marker.append(result);

    // nach dem Einhängen den Docs-Canvas einfärben
    requestAnimationFrame(() => {
      const canvas = marker.closest<HTMLElement>(".docs-story");
      if (!canvas) return;
      canvas.dataset.theme = theme;
      canvas.classList.toggle("dark", dark);
      canvas.style.cssText = "bg-color: var(--color-background) !important; color: var(--color-foreground)";
    });

    return marker;
  },
  ],
};
export default preview;
