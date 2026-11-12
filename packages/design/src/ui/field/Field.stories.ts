import type { Meta, StoryObj } from "@storybook/html-vite";

import { Checkbox } from "../..";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { Button } from "../button";
import { Input } from "../input";
import { Textarea } from "../textarea";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "./Field";
import type { FieldArgs, FieldOrientation } from "./Field.types";

type FieldStoryArgs = FieldArgs & {
  label?: string;
  description?: string;
  errorText?: string;
  controlId?: string;
};

const orientations: FieldOrientation[] = ["vertical", "horizontal", "responsive"];

/** Schmaler Container wie in den Docs (wichtig für Container-Queries bei `responsive`) */
const frame = (inner: string, widthClass = "max-w-md"): string => `<div class="w-full ${widthClass}">${inner}</div>`;

/** Natives Kontrollkästchen (Checkbox-Komponente liegt noch nicht im Design-System) */
const checkbox = (id: string, attributes: HtmlAttributes = {}): string =>
  `<input type="checkbox"${renderAttributes({ id, class: "size-4 shrink-0 accent-primary", ...attributes })}>`;

/** Natives Radio (Radio-Komponente liegt noch nicht im Design-System) */
const radio = (id: string, name: string, attributes: HtmlAttributes = {}): string =>
  `<input type="radio"${renderAttributes({ id, name, class: "size-4 shrink-0 accent-primary", ...attributes })}>`;

const meta: Meta<FieldStoryArgs> = {
  title: "UI-Library/Field",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Kombiniert Label, Steuerelement, Hilfetext und Fehlermeldung zu einem zugänglichen Formularfeld. Port von shadcn/ui (Base, Style vega). Besteht aus Field, FieldGroup, FieldSet, FieldLegend, FieldContent, FieldLabel, FieldTitle, FieldDescription, FieldSeparator und FieldError. Rein statisch, kein Datastar nötig.",
      },
    },
  },
  argTypes: {
    orientation: { control: "select", options: orientations },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    description: { control: "text" },
    errorText: { control: "text" },
  },
  args: {
    orientation: "vertical",
    invalid: false,
    disabled: false,
    label: "Benutzername",
    description: "Wähle einen eindeutigen Benutzernamen für dein Konto.",
    errorText: "Dieser Benutzername ist bereits vergeben.",
    controlId: "field-default-username",
  },
  render: ({ label, description, errorText, controlId, ...args }) => {
    const id = controlId ?? "field-default-username";
    const control = Input({
      attributes: {
        id,
        type: "text",
        placeholder: "evil-rabbit",
        autocomplete: "off",
        "aria-invalid": args.invalid ? "true" : undefined,
        disabled: args.disabled ? true : undefined,
      },
    });

    return frame(
      Field({
        ...args,
        children: [
          FieldLabel({ for: id, children: label }),
          control,
          description ? FieldDescription({ children: description }) : "",
          args.invalid && errorText ? FieldError({ children: errorText }) : "",
        ],
      }),
    );
  },
};

export default meta;
type Story = StoryObj<FieldStoryArgs>;

export const Default: Story = {};

/** Mehrere Felder in einer FieldGroup (Input) */
export const InputFields: Story = {
  render: () =>
      FieldSet({
        children: FieldGroup({
          children: [
            Field({
              children: [
                FieldLabel({ for: "field-input-username", children: "Benutzername" }),
                Input({ attributes: { id: "field-input-username", type: "text", placeholder: "Max Robinson" } }),
                FieldDescription({ children: "Wähle einen eindeutigen Benutzernamen für dein Konto." }),
              ],
            }),
            Field({
              children: [
                FieldLabel({ for: "field-input-password", children: "Passwort" }),
                FieldDescription({ children: "Mindestens 8 Zeichen lang." }),
                Input({ attributes: { id: "field-input-password", type: "password", placeholder: "********" } }),
              ],
            }),
          ],
        }),
      }),
};

/** Textarea mit Beschreibung */
export const TextareaField: Story = {
  render: () =>
    frame(
      FieldSet({
        children: FieldGroup({
          children: Field({
            children: [
              FieldLabel({ for: "field-textarea-feedback", children: "Feedback" }),
              Textarea({
                attributes: {
                  id: "field-textarea-feedback",
                  placeholder: "Deine Rückmeldung hilft uns, besser zu werden ...",
                  rows: 4,
                },
              }),
              FieldDescription({ children: "Sag uns, wie dir unser Service gefällt." }),
            ],
          }),
        }),
      }),
    ),
};

/** FieldSet mit Legende, Beschreibung und mehreren Feldern */
export const Fieldset: Story = {
  render: () =>
    frame(
      FieldSet({
        children: [
          FieldLegend({ children: "Adressdaten" }),
          FieldDescription({ children: "Wir benötigen deine Adresse für die Lieferung." }),
          FieldGroup({
            children: [
              Field({
                children: [
                  FieldLabel({ for: "field-fieldset-street", children: "Strasse" }),
                  Input({ attributes: { id: "field-fieldset-street", type: "text", placeholder: "Hauptstrasse 1" } }),
                ],
              }),
              Field({
                orientation: "responsive",
                children: [
                  FieldContent({
                    children: [
                      FieldLabel({ for: "field-fieldset-city", children: "Ort" }),
                      FieldDescription({ children: "Wohnort für die Lieferung." }),
                    ],
                  }),
                  Input({ attributes: { id: "field-fieldset-city", type: "text", placeholder: "Berlin" } }),
                ],
              }),
            ],
          }),
        ],
      }),
    ),
};

/** Kontrollkästchen in einer FieldGroup mit `data-slot="checkbox-group"`, danach ein Trenner und ein Feld mit FieldContent */
export const Checkboxes: Story = {
  render: () =>
    frame(
      FieldGroup({
        children: [
          FieldSet({
            children: [
              FieldLegend({ variant: "label", children: "Auf dem Desktop anzeigen" }),
              FieldDescription({ children: "Wähle die Elemente, die auf dem Desktop erscheinen sollen." }),
              FieldGroup({
                attributes: { "data-slot": "checkbox-group" },
                children: ["Festplatten", "Externe Laufwerke", "CDs und DVDs"].map((text, index) =>
                  Field({
                    orientation: "horizontal",
                    children: [
                      Checkbox({ id: `field-checkboxes-item-${index}`, checked: index === 0 }),
                      FieldLabel({
                        for: `field-checkboxes-item-${index}`,
                        class: "font-normal",
                        children: text,
                      }),
                    ],
                  }),
                ),
              }),
            ],
          }),
          FieldSeparator(),
          Field({
            orientation: "horizontal",
            children: [
              Checkbox({ id: "field-checkboxes-sync", checked: false }),
              FieldContent({
                children: [
                  FieldLabel({ for: "field-checkboxes-sync", children: "Ordner synchronisieren" }),
                  FieldDescription({
                    children: "Deine Ordner Desktop und Dokumente werden mit der Cloud synchronisiert.",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ),
};

/** Radio-Auswahl in einem FieldSet (`data-slot="radio-group"` steuert den Abstand) */
export const RadioOptions: Story = {
  render: () =>
    frame(
      FieldSet({
        children: [
          FieldLegend({ variant: "label", children: "Abo-Modell" }),
          FieldDescription({ children: "Jahres- und Lebenszeit-Pläne sparen deutlich." }),
          `<div data-slot="radio-group" role="radiogroup" class="grid w-full gap-3">${[
            ["monthly", "Monatlich (9,99 / Monat)"],
            ["yearly", "Jährlich (99,99 / Jahr)"],
            ["lifetime", "Lebenszeit (299,99)"],
          ]
            .map(([value, text]) =>
              Field({
                orientation: "horizontal",
                children: [
                  radio(`field-radio-${value}`, "field-radio-plan", value === "monthly" ? { checked: true } : {}),
                  FieldLabel({ for: `field-radio-${value}`, class: "font-normal", children: text ?? "" }),
                ],
              }),
            )
            .join("")}</div>`,
        ],
      }),
    ),
};

/**
 * Auswahlkarte: Field innerhalb von FieldLabel.
 * Das vorgewählte Radio bekommt `data-checked`, damit `has-data-checked` die Karte hervorhebt
 * (die native Eingabe setzt dieses Attribut nicht selbst; die spätere Radio-Komponente übernimmt das).
 */
export const ChoiceCard: Story = {
  render: () =>
    frame(
      FieldGroup({
        children: FieldSet({
          children: [
            FieldLegend({ variant: "label", children: "Umgebung" }),
            FieldDescription({ children: "Wähle die Umgebung für deinen Cluster." }),
            `<div data-slot="radio-group" role="radiogroup" class="grid w-full gap-3">${[
              ["kubernetes", "Kubernetes", "GPU-Workloads auf einem K8s-Cluster ausführen."],
              ["vm", "Virtuelle Maschine", "Zugriff auf einen Cluster für GPU-Workloads."],
            ]
              .map(([value, title, text]) =>
                FieldLabel({
                  for: `field-choice-${value}`,
                  children: Field({
                    orientation: "horizontal",
                    children: [
                      FieldContent({
                        children: [FieldTitle({ children: title ?? "" }), FieldDescription({ children: text ?? "" })],
                      }),
                      radio(
                        `field-choice-${value}`,
                        "field-choice-env",
                        value === "kubernetes" ? { checked: true, "data-checked": true } : {},
                      ),
                    ],
                  }),
                }),
              )
              .join("")}</div>`,
          ],
        }),
      }),
    ),
};

/** FieldGroup mit FieldSeparator, auch mit Text in der Mitte */
export const GroupWithSeparator: Story = {
  render: () =>
    frame(
      FieldGroup({
        children: [
          FieldSet({
            children: [
              FieldLegend({ variant: "label", children: "Antworten" }),
              FieldDescription({ children: "Benachrichtigung, wenn Anfragen länger dauern." }),
              FieldGroup({
                attributes: { "data-slot": "checkbox-group" },
                children: Field({
                  orientation: "horizontal",
                  children: [
                    checkbox("field-group-push", { checked: true }),
                    FieldLabel({ for: "field-group-push", class: "font-normal", children: "Push-Benachrichtigungen" }),
                  ],
                }),
              }),
            ],
          }),
          FieldSeparator(),
          FieldSet({
            children: [
              FieldLegend({ variant: "label", children: "Aufgaben" }),
              FieldDescription({
                children: `Benachrichtigung bei Änderungen an deinen Aufgaben. <a href="#">Aufgaben verwalten</a>`,
              }),
              FieldGroup({
                attributes: { "data-slot": "checkbox-group" },
                children: Field({
                  orientation: "horizontal",
                  children: [
                    checkbox("field-group-email"),
                    FieldLabel({ for: "field-group-email", class: "font-normal", children: "E-Mail-Benachrichtigungen" }),
                  ],
                }),
              }),
            ],
          }),
          FieldSeparator({ children: "Oder weiter mit" }),
          Field({
            children: [
              FieldLabel({ for: "field-group-mail", children: "E-Mail" }),
              Input({ attributes: { id: "field-group-mail", type: "email", placeholder: "name@example.com" } }),
            ],
          }),
        ],
      }),
    ),
};

/** Horizontale Felder mit FieldContent und FieldTitle */
export const Horizontal: Story = {
  render: () =>
    frame(
      FieldGroup({
        children: [
          Field({
            orientation: "horizontal",
            children: [
              FieldContent({
                children: [
                  FieldTitle({ children: "Touch ID aktivieren" }),
                  FieldDescription({ children: "Entsperre dein Gerät schneller." }),
                ],
              }),
              checkbox("field-horizontal-touch"),
            ],
          }),
          Field({
            orientation: "horizontal",
            disabled: true,
            children: [
              FieldContent({
                children: [
                  FieldTitle({ children: "Zwei-Faktor-Authentifizierung" }),
                  FieldDescription({ children: "Deaktiviert: Titel und Label sind abgedunkelt." }),
                ],
              }),
              checkbox("field-horizontal-mfa", { disabled: true }),
            ],
          }),
        ],
      }),
    ),
};

/** Responsive Layout: ab Container-Breite `md` stehen Label und Steuerelement nebeneinander */
export const ResponsiveLayout: Story = {
  render: () =>
    frame(
      `<form${renderAttributes({ onsubmit: "return false;" })}>${FieldSet({
        children: [
          FieldLegend({ children: "Profil" }),
          FieldDescription({ children: "Trage deine Profildaten ein." }),
          FieldGroup({
            children: [
              Field({
                orientation: "responsive",
                children: [
                  FieldContent({
                    children: [
                      FieldLabel({ for: "field-responsive-name", children: "Name" }),
                      FieldDescription({ children: "Dein vollständiger Name zur Identifikation." }),
                    ],
                  }),
                  Input({ attributes: { id: "field-responsive-name", type: "text", placeholder: "Max Robinson" } }),
                ],
              }),
              FieldSeparator(),
              Field({
                orientation: "responsive",
                children: [
                  Button({ children: "Absenden", attributes: { type: "submit" } }),
                  Button({ children: "Abbrechen", variant: "outline", attributes: { type: "button" } }),
                ],
              }),
            ],
          }),
        ],
      })}</form>`,
      "max-w-4xl",
    ),
};

/** Fehlerzustand: `invalid` am Field, `aria-invalid` am Steuerelement, FieldError direkt danach */
export const Validation: Story = {
  render: () =>
    frame(
      Field({
        invalid: true,
        children: [
          FieldLabel({ for: "field-validation-email", children: "E-Mail" }),
          Input({
            attributes: { id: "field-validation-email", type: "email", "aria-invalid": "true", value: "kein-mail" },
          }),
          FieldError({ children: "Gib eine gültige E-Mail-Adresse ein." }),
        ],
      }),
    ),
};

/** FieldError mit `errors`: Duplikate und leere Meldungen entfallen, mehrere eindeutige Meldungen erscheinen als Liste */
export const ErrorList: Story = {
  render: () =>
    frame(
      Field({
        invalid: true,
        children: [
          FieldLabel({ for: "field-errors-password", children: "Passwort" }),
          Input({ attributes: { id: "field-errors-password", type: "password", "aria-invalid": "true" } }),
          FieldError({
            errors: [
              { message: "Mindestens 8 Zeichen." },
              { message: "Mindestens eine Zahl." },
              { message: "Mindestens 8 Zeichen." },
              undefined,
            ],
          }),
        ],
      }),
    ),
};
