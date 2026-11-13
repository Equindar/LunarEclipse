import type { Meta, StoryObj } from "@storybook/html-vite";

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "./Avatar";
import type { AvatarArgs, AvatarSize } from "./Avatar.types";

// Kleine Beispielbilder (64x64) als Data-URI, damit die Stories ohne externe Assets laufen
const PNG_SOURCE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAACz0lEQVR42tXZTWsUQRAG4LeGXGVk9t/o2aOILmxuq3ERIqwQEDEgiAQVBe9JFI1K/LhrMEHEPxTc7CBey0PPdmbne7t6pqff0x4m2WdCpbuqmy7v/AMzMQgAo+ADmBjEALD04fwxJlZPFj3GvPg9WHps8YHAJd+b/Hj594IYgdd6MAde6wkIvNarEvJYD0bgtb6ohLzS50rINz2QLiEP9cS6hPzUL0rIWz2AwGs9JTuxt3pS+4C/egLWWtJ/2buAXMaT2K4eDLqy/deu/utuAT2djY25NT3SJdSJHsDBQWhLT4ygY73Ku/ehFX2+metCr/L2QyjXZ5q57vQqbz6GQn26mROtOcYR6nUJ2V8xG2b/MJToSbcSot1KFok+aSWEe630BQR6QtKNijoFaQR6qHlA2udYKSEjfUkzt2KXZqGETPUEvRMLekx5jPWLZVTWIY8nsTF9un4m0WdKyLy/d/K3z5SQaDpRHfKquTc6E+p1CVmYrW7fmnevV/OAtclwcnPesZ6YA7tz7Z3xvEs9MejGNG5jKt8/DNtYczJ6ADScxg7PFKT6ZBn1Vq+PFn3VA1hrQ7/7+WLZf/DWcGZRTwwa3Y1t6fc+hc33gfvXZxb0AI0245bWnCZ5cG0m0YNB65uxRP/alJ7Ow6t/DPV6qHeoB/DyW2SmT4Z6t3qVF98jAz0xB33Qqzw/ilbVl90TO9CrPPsRraQvvCd2pld5ehw11+fviR3rVXZOBg31mXvi+vW+szTUp++JW9ytDPLk56CJfqmZq+9zuk0Tvbontt/nWMnjX4NaPemhvrbHhIvU6tULNOqQ3bxAnZ7AgbC/bzWPfg+q9bmjxbLZyl2q9WX3xNnJ0OULVOoL74kL5lq3qdAXNHNlU3k/9dlmrm/6TAnl9UvNXMWJSB9KqFB/XkK15zn91JNuJfqpB2r0+mix5ixtazhzon916bRaT8B/M05YV4GuNdQAAAAASUVORK5CYII=";
const WEBP_SOURCE =
  "data:image/webp;base64,UklGRkACAABXRUJQVlA4IDQCAADQDACdASpAAEAAPm0skkYkIqGhMBgKAIANiWgMsADtxYWyb578QPxV6gvpncA5QDRJ+cB/AOsz9ADpSyvA9in097AnQt9C/9HUeS4CD1SWfeI9oMGVb3p7egfI5wN5zBWPkz+YEHaH+uivImsr9QAA/t8hAf/Z2mMgOUR/9zfgvIvaN3Ii/8IOUCITErYr6C6/pbyV5ntBOihXmPAoq/dayglUzQDcKz/2EeKLdJZlQKVAKcHviKf8/8YYwXU61lX14zEISvbropMUZpnhRCDwmcvAEf1A1yKcGhJzX/vrSoemH5Bg48XACr/QE8MZwNzaxB0IOx71Kpp4g/gRg+qOzyr3gZpg9JIYP3AWCdpu5Xt5tJaY6NURjuMHUYzOBgYQSxBvjhTo6rcQ/TnWTG1A1FyTy4fDX50BsSR4XD/9/n8LxOBzb+qs8I5MD6tJ9FqKBXEq2s3wjIu3NRuD+FALV3SFF8hHjh/stt8Bd0lwSTrHLX2OGj9awNU9l7lJURtpAsfjb13zyaXAD3M2tx1fSM/xFVMxlVduT8YK9lPgXJKSWHdISNUn4E70Qw0jJJ6OADIHMr94fsXhhiZ/JLUMu+SKd35NGVyV8x1QTZpCLthjFjAbzfbIqQVStBZP0777wJJopya3FEwgBfsrFNqmuOQcU1Q5x06fdFUxjMWYf/BlP9QK3V0jWAIcI3xMlFZuKES3anLSUSsoi8tzSJtaXQGjfi/6ryQa0eKrP/+nrDa3gAA=";

/** Nicht auflösbare Bildquelle, um den Fallback bei Ladefehler zu zeigen */
const BROKEN_SOURCE = "/avatar-existiert-nicht.png";

/** Plus-Icon (Lucide-Pfade), Größe und Sichtbarkeit steuert der Avatar über data-size */
const plusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>`;

const sizes: AvatarSize[] = ["sm", "default", "lg"];

type AvatarStoryArgs = AvatarArgs & { text?: string };

const meta: Meta<AvatarStoryArgs> = {
  title: "UI-Library/Avatar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Port von shadcn/ui (Base). Drei Varianten: Default-Avatar mit Text und Hintergrundfarbe, Kurzform mit `source` (webp oder png) oder frei zusammengesetzt aus `AvatarImage`, `AvatarFallback` und `AvatarBadge`. `AvatarGroup` und `AvatarGroupCount` bilden Gruppen. Der Wechsel zum Fallback bei Ladefehler funktioniert nur mit geladenem Datastar.",
      },
    },
  },
  argTypes: {
    size: { control: "select", options: sizes },
    backgroundColor: { control: "color" },
    textColor: { control: "color" },
    source: { control: "text" },
    alt: { control: "text" },
    class: { control: "text" },
  },
  args: {
    text: "JD",
    backgroundColor: "#3b82f6",
  },
  render: ({ text, ...args }) => Avatar({ ...args, children: text }),
};

export default meta;
type Story = StoryObj<AvatarStoryArgs>;

export const Default: Story = {};

export const CustomTextColor: Story = {
  args: {
    text: "AB",
    backgroundColor: "#fde047",
    textColor: "#1f2937"
  },
  render: (args) => Avatar({ ...args, children: args.text })
};

export const BackgroundColors: Story = {
  render: () =>
    `<div class="flex items-center gap-3">${[
      ["AB", "#ef4444"],
      ["CD", "#f97316"],
      ["EF", "#22c55e"],
      ["GH", "hsl(210, 100%, 50%)"],
      ["IJ", "#8b5cf6"],
    ]
      .map(([text, color]) => Avatar({ children: text, backgroundColor: color }))
      .join("")}</div>`,
};

export const WithPngSource: Story = {
  args: { source: PNG_SOURCE, alt: "Beispiel-Avatar (PNG)" },
};

export const WithWebpSource: Story = {
  args: { source: WEBP_SOURCE, alt: "Beispiel-Avatar (WebP)" },
};

/** Mit source werden Text und Farben ignoriert */
export const SourceOverridesText: Story = {
  args: { source: PNG_SOURCE, alt: "Beispiel-Avatar", text: "JD", backgroundColor: "#ef4444" },
};

export const CustomSize: Story = {
  render: () =>
    `<div class="flex items-center gap-3">${Avatar({
      children: "SM",
      backgroundColor: "#3b82f6",
      class: "w-[24px] h-[24px] text-xs",
    })}${Avatar({ children: "MD", backgroundColor: "#3b82f6" })}${Avatar({
      source: WEBP_SOURCE,
      alt: "Großer Avatar",
      class: "w-[64px] h-[64px]",
    })}</div>`,
};

/** Bild mit Fallback (Initialen), wie in den shadcn-Docs: AvatarImage und AvatarFallback als children */
export const Basic: Story = {
  render: () =>
    Avatar({
      children: [AvatarImage({ source: PNG_SOURCE, alt: "@beispiel" }), AvatarFallback({ children: "CN" })],
    }),
};

/** Ohne Bild bleibt der Fallback sichtbar */
export const FallbackOnly: Story = {
  render: () => Avatar({ children: AvatarFallback({ children: "CN" }) }),
};

/** Schlägt das Bild fehl, blendet Datastar es aus und der Fallback wird sichtbar (nur mit geladenem Datastar) */
export const FallbackOnError: Story = {
  render: () =>
    Avatar({
      children: [AvatarImage({ source: BROKEN_SOURCE, alt: "@fehler" }), AvatarFallback({ children: "ER" })],
    }),
};

/** AvatarBadge unten rechts; Farben über `class` */
export const WithBadge: Story = {
  render: () =>
    Avatar({
      children: [
        AvatarImage({ source: PNG_SOURCE, alt: "@beispiel" }),
        AvatarFallback({ children: "CN" }),
        AvatarBadge({ class: "bg-green-600 dark:bg-green-800" }),
      ],
    }),
};

/** Icon im AvatarBadge; bei Größe "sm" wird das Icon automatisch ausgeblendet */
export const BadgeWithIcon: Story = {
  render: () =>
    Avatar({
      children: [AvatarFallback({ children: "PP" }), AvatarBadge({ children: plusIcon })],
    }),
};

/** Überlappende Avatare in einer AvatarGroup */
export const Group: Story = {
  render: () =>
    AvatarGroup({
      children: [
        Avatar({ children: [AvatarImage({ source: PNG_SOURCE, alt: "@eins" }), AvatarFallback({ children: "CN" })] }),
        Avatar({ children: [AvatarImage({ source: WEBP_SOURCE, alt: "@zwei" }), AvatarFallback({ children: "LR" })] }),
        Avatar({ children: [AvatarImage({ source: BROKEN_SOURCE, alt: "@drei" }), AvatarFallback({ children: "ER" })] }),
      ],
    }),
};

/** AvatarGroupCount zeigt, wie viele weitere Avatare es gibt */
export const GroupWithCount: Story = {
  render: () =>
    AvatarGroup({
      children: [
        Avatar({ children: [AvatarImage({ source: PNG_SOURCE, alt: "@eins" }), AvatarFallback({ children: "CN" })] }),
        Avatar({ children: [AvatarImage({ source: WEBP_SOURCE, alt: "@zwei" }), AvatarFallback({ children: "LR" })] }),
        Avatar({ children: [AvatarImage({ source: BROKEN_SOURCE, alt: "@drei" }), AvatarFallback({ children: "ER" })] }),
        AvatarGroupCount({ children: "+3" }),
      ],
    }),
};

/** Icon statt Zahl im AvatarGroupCount */
export const GroupWithIcon: Story = {
  render: () =>
    AvatarGroup({
      children: [
        Avatar({ children: [AvatarImage({ source: PNG_SOURCE, alt: "@eins" }), AvatarFallback({ children: "CN" })] }),
        Avatar({ children: [AvatarImage({ source: WEBP_SOURCE, alt: "@zwei" }), AvatarFallback({ children: "LR" })] }),
        Avatar({ children: [AvatarImage({ source: BROKEN_SOURCE, alt: "@drei" }), AvatarFallback({ children: "ER" })] }),
        AvatarGroupCount({ children: plusIcon }),
      ],
    }),
};

/** `size` setzt data-size; Badge, Fallback-Text und GroupCount passen sich an */
export const Sizes: Story = {
  render: () =>
    `<div class="flex items-center gap-4">${sizes
      .map((size) =>
        Avatar({
          size,
          children: [
            AvatarImage({ source: PNG_SOURCE, alt: `Größe ${size}` }),
            AvatarFallback({ children: "CN" }),
            AvatarBadge({ class: "bg-green-600 dark:bg-green-800" }),
          ],
        }),
      )
      .join("")}</div>`,
};

/** Gruppen in allen Größen: der Zähler übernimmt die Größe der Avatare (group-has-data-[size=...]) */
export const GroupSizes: Story = {
  render: () =>
    `<div class="flex flex-col gap-4">${sizes
      .map((size) =>
        AvatarGroup({
          children: [
            Avatar({ size, children: [AvatarImage({ source: PNG_SOURCE, alt: "@eins" }), AvatarFallback({ children: "CN" })] }),
            Avatar({ size, children: [AvatarImage({ source: WEBP_SOURCE, alt: "@zwei" }), AvatarFallback({ children: "LR" })] }),
            AvatarGroupCount({ children: "+3" }),
          ],
        }),
      )
      .join("")}</div>`,
};
