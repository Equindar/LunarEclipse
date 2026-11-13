import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import { Toast, Toaster } from "./Toast";
import { buildAddToastHandler, buildCloseToastHandler, buildPromiseToastHandler } from "./Toast.expressions";
import type { ToastArgs, ToastType } from "./Toast.types";

type ToastStoryArgs = ToastArgs & { buttonLabel?: string };

const types: ToastType[] = ["success", "info", "warning", "error", "loading"];

/** Button, der beim Klick einen Toast in den Toaster mit der angegebenen ID einfügt */
const addButton = (toasterId: string, label: string, toast: ToastArgs): string =>
  Button({
    variant: "outline",
    children: label,
    attributes: { "data-on:click": buildAddToastHandler(toasterId, Toast(toast)) },
  });

/**
 * Jede Story bekommt einen eigenen Toaster (IDs müssen pro Story eindeutig sein).
 * Der Toaster ist fixiert, deshalb rendern die Docs die Stories in einem iframe.
 */
const demo = (toasterId: string, buttons: string[]): string =>
  `<div class="flex flex-wrap items-center gap-2 p-4">${buttons.join("")}</div>${Toaster({ id: toasterId })}`;

const meta: Meta<ToastStoryArgs> = {
  title: "UI-Library/Toast",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Eine kurze Rückmeldung, die zeitweise unten rechts eingeblendet wird. Port von shadcn/ui (Base, Toast). Funktioniert nur mit geladenem Datastar: Auto-Dismiss, Schließen und das Hinzufügen per Button laufen über Datastar-Expressions. Stapelung und Swipe der Vorlage sind nicht Teil des Ports. Auf dem Server lässt sich Toast() per Datastar-Patch (Modus append) in den Toaster schicken.",
      },
      story: { inline: false, iframeHeight: 280 },
    },
  },
  argTypes: {
    type: { control: "select", options: [undefined, ...types] },
    title: { control: "text" },
    description: { control: "text" },
    timeout: { control: "number" },
    closable: { control: "boolean" },
  },
  args: {
    title: "Event created",
    description: "Sunday, December 3 at 9:00 AM",
    buttonLabel: "Show Toast",
  },
  render: ({ buttonLabel, ...args }) => demo("toaster-default", [addButton("toaster-default", buttonLabel ?? "Show Toast", args)]),
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

export const Default: Story = {};

/** Mit `type` erscheint ein Status-Icon; "loading" bleibt ohne `timeout` stehen, hier auf 3 Sekunden gesetzt */
export const Types: Story = {
  render: () =>
    demo(
      "toaster-types",
      types.map((type) =>
        addButton("toaster-types", type.charAt(0).toUpperCase() + type.slice(1), {
          type,
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} toast`,
          description: "Sunday, December 3 at 9:00 AM",
          timeout: type === "loading" ? 3000 : undefined,
        })
      )
    ),
};

/** `action` rendert einen Button; hier schließt er den Toast (wie toast.close(id)) */
export const Action: Story = {
  render: () =>
    demo("toaster-action", [
      addButton("toaster-action", "Show Toast", {
        title: "Event created",
        action: { children: "Undo", onClick: buildCloseToastHandler() },
      }),
    ]),
};

/** Wie toast.promise: ein Loading-Toast, der nach 2 Sekunden zu Erfolg oder Fehler wird */
export const WithPromise: Story = {
  render: () => {
    const id = "toaster-promise";
    const states = {
      loading: Toast({ type: "loading", title: "Saving..." }),
      success: Toast({ type: "success", title: "Saved" }),
      error: Toast({ type: "error", title: "Could not save" }),
    };

    const button = (label: string, promise: string): string =>
      Button({
        variant: "outline",
        children: label,
        attributes: {
          "data-on:click": buildPromiseToastHandler(id, promise, states.loading, states.success, states.error),
        },
      });

    return demo(id, [
      button("Save (success)", "new Promise((resolve) => setTimeout(resolve, 2000))"),
      button("Save (error)", "new Promise((resolve, reject) => setTimeout(reject, 2000))"),
    ]);
  },
};

/** Vorschau ohne Toaster und ohne Auto-Dismiss, um das Aussehen aller Typen zu prüfen */
export const Static: Story = {
  parameters: { docs: { story: { inline: true } } },
  render: () =>
    `<div class="flex w-96 flex-col gap-3">${[
      Toast({ title: "Event created", description: "Sunday, December 3 at 9:00 AM", timeout: 0 }),
      ...types.map((type) => Toast({ type, title: `${type} toast`, description: "Beschreibung", timeout: 0 })),
      Toast({ title: "Event created", action: { children: "Undo" }, timeout: 0 }),
    ].join("")}</div>`,
};
