import type { Meta, StoryObj } from "@storybook/html-vite";

import { Button } from "../button";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Form, FormDescription, FormItem, FormLabel, FormMessage } from "./Form";
import type { FormArgs } from "./Form.types";

/** Verhindert in Storybook den nativen Submit (Seiten-Reload), da die Stories keine action haben */
const noSubmit = { onsubmit: "return false;" };

const meta: Meta<FormArgs> = {
  title: "UI-Library/Form",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Formulare mit Validierung und Barrierefreiheit: FormItem, FormLabel, FormDescription und FormMessage. Mit `action` wird ein Datastar-Submit-Handler (`@post`) gesetzt.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<FormArgs>;

/** Einfaches Formular mit Input und Beschreibung */
export const BasicForm: Story = {
  render: () =>
    Form({
      id: "form-basic",
      class: "w-80 space-y-6",
      attributes: noSubmit,
      children: [
        FormItem({
          children: [
            FormLabel({ for: "form-basic-username", children: "Username" }),
            Input({
              id: "form-basic-username",
              name: "username",
              placeholder: "shadcn",
              attributes: { "aria-describedby": "form-basic-username-description" },
            }),
            FormDescription({
              id: "form-basic-username-description",
              children: "This is your public display name.",
            }),
          ],
        }),
        Button({ children: "Submit" }),
      ],
    }),
};

/** Fehlerzustand: Label wird über data-error="true" rot, die Fehlermeldung erscheint unter dem Feld */
export const WithValidation: Story = {
  render: () =>
    Form({
      id: "form-validation",
      class: "w-80 space-y-6",
      attributes: noSubmit,
      children: [
        FormItem({
          children: [
            FormLabel({ for: "form-validation-email", hasError: true, children: "Email" }),
            Input({
              type: "email",
              id: "form-validation-email",
              name: "email",
              value: "not-an-email",
              attributes: { "aria-invalid": "true", "aria-describedby": "form-validation-email-message" },
            }),
            FormMessage({ id: "form-validation-email-message", message: "Please enter a valid email address." }),
            FormDescription({ children: "We'll never share your email with anyone else." }),
          ],
        }),
        FormItem({
          children: [
            FormLabel({ for: "form-validation-password", children: "Password" }),
            Input({ type: "password", id: "form-validation-password", name: "password" }),
            FormDescription({ children: "Must be at least 8 characters long." }),
          ],
        }),
        Button({ children: "Submit" }),
      ],
    }),
};

/** Komplexeres Formular mit mehreren Feldtypen */
export const ContactForm: Story = {
  render: () =>
    Form({
      id: "form-contact",
      class: "w-96 space-y-6",
      attributes: noSubmit,
      children: [
        FormItem({
          children: [
            FormLabel({ for: "form-contact-name", children: "Name" }),
            Input({ id: "form-contact-name", name: "name", placeholder: "Your name" }),
          ],
        }),
        FormItem({
          children: [
            FormLabel({ for: "form-contact-email", children: "Email" }),
            Input({ type: "email", id: "form-contact-email", name: "email", placeholder: "name@example.com" }),
          ],
        }),
        FormItem({
          children: [
            FormLabel({ for: "form-contact-subject", children: "Subject" }),
            Input({ id: "form-contact-subject", name: "subject", placeholder: "What is this about?" }),
          ],
        }),
        FormItem({
          children: [
            FormLabel({ for: "form-contact-message", children: "Message" }),
            Textarea({ id: "form-contact-message", name: "message", placeholder: "Type your message here." }),
            FormDescription({ children: "Please provide as much detail as possible." }),
          ],
        }),
        `<div class="flex gap-2">${Button({ children: "Send Message" })}${Button({ children: "Clear", variant: "outline" })}</div>`,
      ],
    }),
};
