import type { Meta, StoryObj } from "@storybook/html-vite";

import { type HtmlAttributes, renderAttributes } from "../../utils/renderHtmlAttributes";
import { Button } from "../button";
import {
    Stepper,
    StepperContent,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperList,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
    stepperNextAttributes,
    stepperPrevAttributes,
} from "./Stepper";
import { stepperSignals } from "./Stepper.expressions";
import type { StepperArgs, StepperStep } from "./Stepper.types";

type StepperStoryArgs = Pick<
  StepperArgs,
  "id" | "defaultValue" | "orientation" | "activationMode" | "dir" | "loop" | "disabled" | "nonInteractive"
>;

interface DemoStep {
  value: string;
  title: string;
  description: string;
}

/** Schritte des Standard-Beispiels (Dice UI: stepper-demo) */
const accountSteps: DemoStep[] = [
  { value: "account", title: "Account Setup", description: "Create your account and verify email" },
  { value: "profile", title: "Profile Information", description: "Add your personal details and preferences" },
  { value: "payment", title: "Payment Details", description: "Set up billing and payment methods" },
  { value: "complete", title: "Complete Setup", description: "Review and finish your account setup" },
];

const toSteps = (steps: DemoStep[]): StepperStep[] => steps.map(({ value }) => ({ value }));

const panelClass = "flex flex-col items-center gap-4 rounded-md border bg-card p-4 text-card-foreground";

/** Inhalt eines Schritts mit Titel, Beschreibung und Platzhaltertext */
const panelContent = (step: DemoStep): string =>
  `<div class="flex flex-col items-center gap-px text-center"><h3 class="text-lg font-semibold">${step.title}</h3><p class="text-muted-foreground">${step.description}</p></div><p class="text-sm">Content for ${step.title} goes here.</p>`;

/** Standard-Stepper: nur Indikatoren und Separatoren, darunter der Inhalt des aktiven Schritts */
const basicStepper = (args: StepperStoryArgs, steps: StepperStep[] = toSteps(accountSteps)): string => {
  const id = args.id ?? "stepper-default";
  const orientation = args.orientation ?? "horizontal";

  return Stepper({
    ...args,
    id,
    steps,
    class: "w-full max-w-md",
    children: [
      StepperList({
        orientation,
        children: accountSteps.map((step) =>
          StepperItem({
            id,
            value: step.value,
            orientation,
            children: [
              StepperTrigger({ id, value: step.value, children: StepperIndicator({ id, value: step.value }) }),
              StepperSeparator({ id, value: step.value, orientation }),
            ],
          })
        ),
      }),
      ...accountSteps.map((step) =>
        StepperContent({ id, value: step.value, class: panelClass, children: panelContent(step) })
      ),
    ],
  });
};

/** Stepper mit Titel und Beschreibung je Schritt (Basis für die Formular-Beispiele) */
const labeledList = (id: string, steps: DemoStep[], separatorClass: string): string =>
  StepperList({
    children: steps.map((step) =>
      StepperItem({
        id,
        value: step.value,
        children: [
          StepperTrigger({
            id,
            value: step.value,
            children: [
              StepperIndicator({ id, value: step.value }),
              `<div class="flex flex-col gap-1">${StepperTitle({ id, value: step.value, children: step.title })}${StepperDescription({ id, value: step.value, children: step.description })}</div>`,
            ],
          }),
          StepperSeparator({ id, value: step.value, class: separatorClass }),
        ],
      })
    ),
  });

const inputClass =
  "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive";

interface FieldOptions {
  /** Eindeutige ID des Feldes (auch Präfix des Signals) */
  id: string;
  label: string;
  /** Signal-Name für data-bind (flach, mit Story-Präfix, weil alle Stories auf einer Docs-Seite dieselben Signale teilen) */
  signal: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  /** Zusätzliche Validierungs-Attribute (required, minlength, pattern ...) */
  validation?: HtmlAttributes;
  class?: string;
}

/** Natives Formularfeld mit Label und Datastar-Bindung (Validierung per Constraint Validation API) */
const field = (options: FieldOptions): string => {
  const attrs: HtmlAttributes = {
    id: options.id,
    name: options.id,
    placeholder: options.placeholder,
    class: options.textarea ? `${inputClass} h-auto ${options.class ?? "min-h-[80px]"}` : inputClass,
    [`data-bind:${options.signal}`]: true,
    ...options.validation,
  };
  if (!options.textarea) attrs.type = options.type ?? "text";

  const control = options.textarea
    ? `<textarea${renderAttributes(attrs)}></textarea>`
    : `<input${renderAttributes(attrs)} />`;

  return `<div class="flex flex-col gap-2"><label for="${options.id}" class="text-sm font-medium">${options.label}</label>${control}</div>`;
};

/**
 * Validierung für onValidate: Rückwärts ist immer erlaubt, vorwärts nur, wenn alle Felder
 * im aktuellen Schritt gültig sind (reportValidity zeigt die Meldung am ersten ungültigen Feld).
 */
const validateCurrentStep = (id: string): string =>
  `direction === 'prev' || ((panel) => !panel || Array.from(panel.querySelectorAll('input, textarea')).every((field) => field.reportValidity()))(document.getElementById(${JSON.stringify(`${id}-content-`)} + ${stepperSignals(id).signal("value")}))`;

/** Fußzeile mit Zurück, Schrittanzeige und Weiter bzw. Abschließen (letzter Schritt) */
const wizardFooter = (id: string, lastValue: string, submitLabel: string, spacing = ""): string => {
  const s = stepperSignals(id);
  const position = `'Step ' + (${s.signal("steps")}.indexOf(${s.signal("value")}) + 1) + ' of ' + ${s.signal("steps")}.length`;
  const notLast = `${s.signal("value")} !== ${JSON.stringify(lastValue)}`;
  const last = `${s.signal("value")} === ${JSON.stringify(lastValue)}`;

  return `<div class="${spacing} flex items-center justify-between">${Button({
    variant: "outline",
    children: "Previous",
    attributes: stepperPrevAttributes({ id }),
  })}<div class="text-sm text-muted-foreground" data-text="${position}"></div><div${renderAttributes({
    "data-show": notLast,
  })}>${Button({ children: "Next", attributes: stepperNextAttributes({ id }) })}</div><div${renderAttributes({
    "data-show": last,
    style: "display: none;",
  })}>${Button({ children: submitLabel, attributes: { type: "submit" } })}</div></div>`;
};

const meta: Meta<StepperStoryArgs> = {
  title: "UI-Library/Stepper",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Führt Nutzer durch einen mehrstufigen Ablauf mit klaren Fortschrittsanzeigen. Aufgebaut aus Dice UI (Base), das auf shadcn/ui basiert. Funktioniert nur mit geladenem Datastar: Zustand, Tastaturbedienung und das Ein- und Ausblenden der Inhalte laufen über Signale. Alle Teile bekommen dieselbe `id` wie der Root, die Schritte werden am Root über `steps` angegeben.",
      },
    },
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    activationMode: { control: "inline-radio", options: ["automatic", "manual"] },
    dir: { control: "inline-radio", options: ["ltr", "rtl"] },
    defaultValue: { control: "select", options: accountSteps.map((step) => step.value) },
    loop: { control: "boolean" },
    disabled: { control: "boolean" },
    nonInteractive: { control: "boolean" },
  },
  args: {
    id: "stepper-default",
    defaultValue: "account",
    orientation: "horizontal",
    activationMode: "automatic",
    loop: false,
    disabled: false,
    nonInteractive: false,
  },
  render: (args) => `<div class="p-6">${basicStepper(args)}</div>`,
};

export default meta;
type Story = StoryObj<StepperStoryArgs>;

export const Default: Story = {};

export const Vertical: Story = {
  name: "Vertical Layout",
  parameters: {
    docs: { description: { story: "Vertikale Ausrichtung für kompakte Layouts. Die Linie wird absolut hinter den Indikatoren positioniert." } },
  },
  render: () => {
    const id = "stepper-vertical";
    const steps: DemoStep[] = [
      { value: "placed", title: "Order Placed", description: "Your order has been successfully placed" },
      { value: "processing", title: "Processing", description: "We're preparing your items for shipment" },
      { value: "shipped", title: "Shipped", description: "Your order is on its way to you" },
      { value: "delivered", title: "Delivered", description: "Order delivered to your address" },
    ];

    return `<div class="p-6">${Stepper({
      id,
      steps: toSteps(steps),
      defaultValue: "shipped",
      orientation: "vertical",
      class: "max-w-md",
      children: [
        StepperList({
          orientation: "vertical",
          children: steps.map((step) =>
            StepperItem({
              id,
              value: step.value,
              orientation: "vertical",
              children: [
                StepperTrigger({
                  id,
                  value: step.value,
                  class: "not-last:pb-6",
                  children: [
                    StepperIndicator({ id, value: step.value }),
                    `<div class="flex flex-col gap-1">${StepperTitle({ id, value: step.value, children: step.title })}${StepperDescription({ id, value: step.value, children: step.description })}</div>`,
                  ],
                }),
                StepperSeparator({
                  id,
                  value: step.value,
                  orientation: "vertical",
                  class: "absolute inset-y-0 top-5 left-3.5 -z-10 -order-1 h-full -translate-x-1/2",
                }),
              ],
            })
          ),
        }),
        ...steps.map((step) =>
          StepperContent({
            id,
            value: step.value,
            class: "flex flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground",
            children: `<div class="flex flex-col gap-px"><h4 class="font-semibold">${step.title}</h4><p class="text-sm text-muted-foreground">${step.description}</p></div><p class="text-sm">This is the content for ${step.title}. You can add forms, information, or any other content here.</p>`,
          })
        ),
      ],
    })}</div>`;
  },
};

export const WithValidation: Story = {
  name: "With Validation",
  parameters: {
    docs: {
      description: {
        story:
          "`onValidate` prüft vor jedem Vorwärtswechsel den aktuellen Schritt (hier per Constraint Validation der Felder). Schlägt die Prüfung fehl, bleibt der Schritt aktiv. Die Prüfung ist synchron. Die Felder sind mit `data-bind` an Signale gebunden, damit der letzte Schritt die Eingaben anzeigen kann.",
      },
    },
  },
  render: () => {
    const id = "stepper-validation";
    const p = "validation";
    const steps: DemoStep[] = [
      { value: "account", title: "Account Setup", description: "Create your account" },
      { value: "profile", title: "Profile Info", description: "Complete your profile" },
      { value: "review", title: "Review", description: "Review your information" },
    ];
    const signals = JSON.stringify({
      [`${p}_username`]: "",
      [`${p}_email`]: "",
      [`${p}_first_name`]: "",
      [`${p}_last_name`]: "",
      [`${p}_bio`]: "",
    });
    const reviewItem = (label: string, signal: string): string =>
      `<div class="flex flex-col gap-1 rounded-md border p-2"><span class="text-sm font-medium">${label}</span><p class="text-sm" data-text="$${signal} || 'Not provided'"></p></div>`;
    const content = "flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground";

    return `<form${renderAttributes({ class: "w-full max-w-3xl p-6", "data-signals": signals, onsubmit: "return false;" })}>${Stepper({
      id,
      steps: toSteps(steps),
      defaultValue: "account",
      onValidate: validateCurrentStep(id),
      children: [
        labeledList(id, steps, "mx-4"),
        StepperContent({
          id,
          value: "account",
          class: content,
          children: [
            field({ id: `${id}-username`, label: "Username", signal: `${p}_username`, placeholder: "Enter username", validation: { required: true, minlength: 3, pattern: "[a-zA-Z0-9_]+", title: "Letters, numbers, and underscores only" } }),
            field({ id: `${id}-email`, label: "Email", signal: `${p}_email`, type: "email", placeholder: "Enter email", validation: { required: true } }),
          ],
        }),
        StepperContent({
          id,
          value: "profile",
          class: content,
          children: [
            `<div class="grid grid-cols-2 gap-4">${field({ id: `${id}-first-name`, label: "First Name", signal: `${p}_first_name`, placeholder: "Enter first name", validation: { required: true } })}${field({ id: `${id}-last-name`, label: "Last Name", signal: `${p}_last_name`, placeholder: "Enter last name", validation: { required: true } })}</div>`,
            field({ id: `${id}-bio`, label: "Bio", signal: `${p}_bio`, placeholder: "Tell us about yourself...", textarea: true, validation: { required: true, minlength: 10 } }),
          ],
        }),
        StepperContent({
          id,
          value: "review",
          class: "grid grid-cols-2 gap-4 rounded-md border bg-card p-4 text-card-foreground lg:grid-cols-3",
          children: [
            reviewItem("Username", `${p}_username`),
            reviewItem("Email", `${p}_email`),
            reviewItem("First Name", `${p}_first_name`),
            reviewItem("Last Name", `${p}_last_name`),
            reviewItem("Bio", `${p}_bio`),
          ],
        }),
        wizardFooter(id, "review", "Complete Setup"),
      ],
    })}</form>`;
  },
};

export const WithForm: Story = {
  name: "With Form",
  parameters: {
    docs: {
      description: {
        story:
          "Stepper in einem Formular: Jeder Schritt hat eigene Felder, `onValidate` prüft sie vor dem Weitergehen. Das Formular wird in Storybook nicht abgeschickt (`onsubmit` verhindert das Neuladen).",
      },
    },
  },
  render: () => {
    const id = "stepper-form";
    const p = "form";
    const steps: DemoStep[] = [
      { value: "personal", title: "Personal Details", description: "Enter your basic information" },
      { value: "about", title: "About You", description: "Tell us more about yourself" },
      { value: "professional", title: "Professional Info", description: "Add your professional details" },
    ];
    const signals = JSON.stringify({
      [`${p}_first_name`]: "",
      [`${p}_last_name`]: "",
      [`${p}_email`]: "",
      [`${p}_bio`]: "",
      [`${p}_company`]: "",
      [`${p}_website`]: "",
    });
    const hint = (text: string): string => `<p class="text-sm text-muted-foreground">${text}</p>`;

    return `<form${renderAttributes({ class: "w-full max-w-3xl p-6", "data-signals": signals, onsubmit: "return false;" })}>${Stepper({
      id,
      steps: toSteps(steps),
      defaultValue: "personal",
      onValidate: validateCurrentStep(id),
      children: [
        labeledList(id, steps, "mx-4"),
        StepperContent({
          id,
          value: "personal",
          children: `<div class="flex flex-col gap-4"><div class="grid grid-cols-2 gap-4">${field({ id: `${id}-first-name`, label: "First Name", signal: `${p}_first_name`, placeholder: "John", validation: { required: true, minlength: 2 } })}${field({ id: `${id}-last-name`, label: "Last Name", signal: `${p}_last_name`, placeholder: "Doe", validation: { required: true, minlength: 2 } })}</div>${field({ id: `${id}-email`, label: "Email", signal: `${p}_email`, type: "email", placeholder: "john.doe@example.com", validation: { required: true } })}</div>`,
        }),
        StepperContent({
          id,
          value: "about",
          children: `<div class="flex flex-col gap-2">${field({ id: `${id}-bio`, label: "Bio", signal: `${p}_bio`, placeholder: "Tell us about yourself...", textarea: true, class: "min-h-[120px]", validation: { required: true, minlength: 10 } })}${hint("Write a brief description about yourself.")}</div>`,
        }),
        StepperContent({
          id,
          value: "professional",
          children: `<div class="flex flex-col gap-4">${field({ id: `${id}-company`, label: "Company", signal: `${p}_company`, placeholder: "Acme Inc.", validation: { required: true, minlength: 2 } })}<div class="flex flex-col gap-2">${field({ id: `${id}-website`, label: "Website", signal: `${p}_website`, type: "url", placeholder: "https://example.com" })}${hint("Optional: Your personal or company website.")}</div></div>`,
        }),
        wizardFooter(id, "professional", "Complete", "mt-4"),
      ],
    })}</form>`;
  },
};

export const CompletedAndDisabled: Story = {
  name: "Completed and Disabled Steps",
  parameters: {
    docs: {
      description: {
        story:
          "Einzelne Schritte können im Root über `steps` als abgeschlossen (`completed`) oder deaktiviert (`disabled`) markiert werden. Beide Listen liegen als Signale (`completed`, `disabledSteps`) vor und lassen sich zur Laufzeit ändern.",
      },
    },
  },
  render: () => {
    const id = "stepper-states";
    const steps: StepperStep[] = [
      { value: "account", completed: true },
      { value: "profile" },
      { value: "payment", disabled: true },
      { value: "complete" },
    ];
    return `<div class="p-6">${basicStepper({ id, defaultValue: "profile" }, steps)}</div>`;
  },
};

export const ManualActivation: Story = {
  name: "Manual Activation",
  parameters: {
    docs: {
      description: {
        story:
          "Im Modus `manual` bewegen die Pfeiltasten nur den Fokus, aktiviert wird per Enter, Leertaste oder Klick. Mit `loop` springen die Pfeiltasten am Ende wieder an den Anfang.",
      },
    },
  },
  render: () => `<div class="p-6">${basicStepper({ id: "stepper-manual", defaultValue: "account", activationMode: "manual", loop: true })}</div>`,
};

export const NonInteractive: Story = {
  name: "Non-interactive",
  parameters: {
    docs: {
      description: {
        story:
          "Rein anzeigend: Klick, Fokus-Aktivierung und Enter wechseln den Schritt nicht. Der Fortschritt wird von außen über das Signal gesetzt (hier mit den Buttons).",
      },
    },
  },
  render: () => {
    const id = "stepper-readonly";
    return `<div class="flex flex-col gap-4 p-6">${Stepper({
      id,
      steps: toSteps(accountSteps),
      defaultValue: "profile",
      nonInteractive: true,
      class: "w-full max-w-md",
      children: [
        StepperList({
          children: accountSteps.map((step) =>
            StepperItem({
              id,
              value: step.value,
              children: [
                StepperTrigger({ id, value: step.value, children: StepperIndicator({ id, value: step.value }) }),
                StepperSeparator({ id, value: step.value }),
              ],
            })
          ),
        }),
        `<div class="flex justify-between">${Button({ variant: "outline", children: "Previous", attributes: stepperPrevAttributes({ id }) })}${Button({ children: "Next", attributes: stepperNextAttributes({ id }) })}</div>`,
      ],
    })}</div>`;
  },
};
