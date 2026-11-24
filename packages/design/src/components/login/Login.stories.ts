import type { Meta, StoryObj } from "@storybook/html-vite";

import { Icon } from "../../ui/icon";
import { LoginForm, LoginPage } from "./Login";
import type {
    LoginFormArgs,
    LoginFormVariant,
    LoginPageLayout,
    LoginProvider,
    LoginProviderLayout,
    LoginProvidersPosition,
} from "./Login.types";

type LoginStoryArgs = LoginFormArgs & {
  pageLayout?: LoginPageLayout;
  showErrors?: boolean;
};

const variants: LoginFormVariant[] = ["card", "plain", "split"];
const pageLayouts: LoginPageLayout[] = ["centered", "muted", "split", "wide"];
const providerLayouts: LoginProviderLayout[] = ["stack", "columns", "icons"];
const providerPositions: LoginProvidersPosition[] = ["top", "bottom"];

const brand = "Acme Inc.";

const provider = (id: "apple" | "google" | "github" | "meta", label: string): LoginProvider => ({
  id,
  label,
  icon: Icon({ name: id, }),
});

const exampleErrors = {
  form: "Anmeldung fehlgeschlagen. Bitte prüfe deine Eingaben.",
  email: "Gib eine gültige E-Mail-Adresse ein.",
  password: "Das Passwort ist nicht korrekt.",
};

const meta: Meta<LoginStoryArgs> = {
  title: "Components/Login",
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, iframeHeight: 760 },
      description: {
        component:
          "Anmeldeseite nach den Login-Blöcken von shadcn/ui (login-01 bis login-05), umgesetzt mit Card, Field, Input und Button des Design-Systems. LoginForm rendert das Formular, LoginPage das Seitenlayout darum. Die Komponente ist statisch; Absenden und Anmelde-Anbieter hängt man über `attributes` an (z. B. Datastar).",
      },
    },
  },
  argTypes: {
    pageLayout: { control: "select", options: pageLayouts },
    variant: { control: "select", options: variants },
    headerAlign: { control: "inline-radio", options: ["start", "center"] },
    providerLayout: { control: "inline-radio", options: providerLayouts },
    providersPosition: { control: "inline-radio", options: providerPositions },
    signUpPosition: { control: "inline-radio", options: ["header", "footer"] },
    showPassword: { control: "boolean" },
    showSignUp: { control: "boolean" },
    showTerms: { control: "boolean" },
    showErrors: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    separatorText: { control: "text" },
  },
  args: {
    pageLayout: "centered",
    variant: "card",
    headerAlign: "start",
    title: "Bei deinem Konto anmelden",
    description: "Gib unten deine E-Mail-Adresse ein, um dich anzumelden.",
    providerLayout: "stack",
    providersPosition: "bottom",
    separatorText: "Oder weiter mit",
    signUpPosition: "footer",
    showPassword: true,
    showSignUp: true,
    showTerms: false,
    showErrors: false,
    brand,
  },
  render: ({ pageLayout, showErrors, ...args }) =>
    LoginPage({
      layout: pageLayout,
      brand,
      logo: Icon({ name: "gallery-vertical-end", }),
      children: LoginForm({
        ...args,
        logo: Icon({ name: "gallery-vertical-end", }),
        providers: [provider("google", "Mit Google anmelden"), provider("github", "Mit GitHub anmelden")],
        errors: showErrors ? exampleErrors : undefined,
      }),
    }),
};

export default meta;
type Story = StoryObj<LoginStoryArgs>;

/** Alle Optionen im Controls-Panel einstellbar */
export const Playground: Story = {};

/** login-01: einfache Karte, Google-Button direkt unter "Anmelden" */
export const Simple: Story = {
  tags: ['readonly'],
  render: () =>
    LoginPage({
      layout: "centered",
      children: LoginForm({
        title: "Bei deinem Konto anmelden",
        description: "Gib unten deine E-Mail-Adresse ein, um dich anzumelden.",
        providers: [provider("google", "Mit Google anmelden")],
      }),
    }),
};

/** login-02: zwei Spalten mit Titelbild, Formular ohne Karte */
export const TwoColumn: Story = {
  render: () =>
    LoginPage({
      layout: "split",
      brand,
      logo: Icon({ name: "gallery-vertical-end", }),
      children: LoginForm({
        variant: "plain",
        title: "Bei deinem Konto anmelden",
        description: "Gib unten deine E-Mail-Adresse ein, um dich anzumelden.",
        separatorText: "Oder weiter mit",
        providers: [provider("github", "Mit GitHub anmelden")],
      }),
    }),
};

/** login-03: gedämpfter Hintergrund, Anbieter oberhalb der E-Mail-Anmeldung, Hinweis auf die Bedingungen */
export const MutedBackground: Story = {
  render: () =>
    LoginPage({
      layout: "muted",
      brand,
      logo: Icon({ name: "gallery-vertical-end", }),
      children: LoginForm({
        title: "Willkommen zurück",
        description: "Melde dich mit deinem Apple- oder Google-Konto an.",
        headerAlign: "center",
        providersPosition: "top",
        separatorText: "Oder weiter mit",
        providers: [provider("apple", "Mit Apple anmelden"), provider("google", "Mit Google anmelden")],
        showTerms: true,
      }),
    }),
};

/** login-04: Karte mit Bildspalte und Anbietern als Icon-Buttons */
export const WithImage: Story = {
  render: () =>
    LoginPage({
      layout: "wide",
      children: LoginForm({
        variant: "split",
        title: "Willkommen zurück",
        description: "Melde dich bei deinem Acme-Konto an.",
        providerLayout: "icons",
        separatorText: "Oder weiter mit",
        providers: [
          provider("apple", "Mit Apple anmelden"),
          provider("google", "Mit Google anmelden"),
          provider("meta", "Mit Meta anmelden"),
        ],
        showTerms: true,
      }),
    }),
};

/** login-05: nur E-Mail, Logo im Kopf, Registrieren-Hinweis oben */
export const EmailOnly: Story = {
  render: () =>
    LoginPage({
      layout: "centered",
      children: LoginForm({
        variant: "plain",
        logo: Icon({ name: "gallery-vertical-end", }),
        brand,
        title: "Willkommen bei Acme Inc.",
        showPassword: false,
        signUpPosition: "header",
        providerLayout: "columns",
        separatorText: "Oder",
        providers: [provider("apple", "Weiter mit Apple"), provider("google", "Weiter mit Google")],
        showTerms: true,
      }),
    }),
};

/** Fehlerzustand: Meldung für das Formular und je Feld (`data-invalid` und `aria-invalid` werden gesetzt) */
export const WithErrors: Story = {
  render: () =>
    LoginPage({
      layout: "centered",
      children: LoginForm({
        title: "Bei deinem Konto anmelden",
        description: "Gib unten deine E-Mail-Adresse ein, um dich anzumelden.",
        values: { email: "max@beispiel" },
        errors: exampleErrors,
        providers: [provider("google", "Mit Google anmelden")],
      }),
    }),
};
