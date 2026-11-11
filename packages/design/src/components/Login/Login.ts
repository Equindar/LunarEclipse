import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "../../ui/field";
import { Input } from "../../ui/input";
import { cn } from "../../utils/cn";
import { escapeHtml } from "../../utils/escapeHtml";
import { renderChildren } from "../../utils/renderChildren";
import { renderAttributes, type HtmlAttributes } from "../../utils/renderHtmlAttributes";
import { safeUrl } from "../../utils/safeUrl";
import { tw } from "../../utils/tw";
import type {
    LoginBrandArgs,
    LoginFormArgs,
    LoginLabels,
    LoginPageArgs,
    LoginProvider,
    LoginProviderLayout,
} from "./Login.types";

/*
 * Aufbau nach den Login-Blöcken von shadcn/ui (login-01 bis login-05), umgesetzt mit den Elementen
 * des Design-Systems: Card, Field, Input, Button. Rein statisch, die Interaktion (Absenden, Anbieter)
 * hängt der Nutzer über `attributes` an (z. B. Datastar).
 */

const loginFormTw = tw`flex flex-col gap-6`;
const loginLinkTw = tw`text-sm underline-offset-4 hover:underline`;
const loginIconTw = tw`inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-full`;
const loginTermsTw = tw`px-6 text-center`;
const loginSeparatorTw = tw`*:data-[slot=field-separator-content]:bg-card`;

const loginProviderLayoutTw: Record<LoginProviderLayout, string> = {
  stack: "",
  columns: tw`grid gap-4 sm:grid-cols-2`,
  icons: tw`grid gap-4`,
};

/** Spaltenzahl für `icons`; feste Klassen, damit Tailwind sie findet */
const loginIconColumnsTw: Record<number, string> = {
  1: tw`grid-cols-1`,
  2: tw`grid-cols-2`,
  3: tw`grid-cols-3`,
  4: tw`grid-cols-4`,
};

const loginHeaderTw = tw`flex flex-col items-center gap-2 text-center`;
const loginCoverTw = tw`relative hidden bg-muted md:block`;
const loginPageCoverTw = tw`relative hidden bg-muted lg:block`;
const loginCoverImageTw = tw`absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale`;
const loginCoverFallbackTw = tw`absolute inset-0 bg-linear-to-br from-primary/20 via-muted to-secondary dark:opacity-60`;

const loginBrandTw = tw`flex items-center gap-2 font-medium`;
const loginBrandLogoTw = tw`flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground`;

const defaultLabels: Required<LoginLabels> = {
  email: "E-Mail",
  emailPlaceholder: "name@beispiel.de",
  password: "Passwort",
  forgotPassword: "Passwort vergessen?",
  submit: "Anmelden",
  signUpQuestion: "Noch kein Konto?",
  signUp: "Registrieren",
  termsBefore: "Mit dem Klick auf Weiter stimmst du unseren",
  terms: "Nutzungsbedingungen",
  termsAnd: "und der",
  privacy: "Datenschutzerklärung",
  termsAfter: "zu.",
};

function link(href: string, text: string, className?: string): string {
  const classAttr = className ? ` class="${escapeHtml(className)}"` : "";
  return `<a href="${escapeHtml(safeUrl(href))}"${classAttr}>${escapeHtml(text)}</a>`;
}

/** Fehlermeldung unter einem Feld; leer, wenn keine Meldung vorliegt */
function renderFieldError(message?: string): string {
  return message ? FieldError({ children: escapeHtml(message) }) : "";
}

function renderProviders(providers: LoginProvider[], layout: LoginProviderLayout): string[] {
  return providers.map((provider) => {
    const icon = provider.icon ? `<span class="${loginIconTw}" aria-hidden="true">${provider.icon}</span>` : "";
    const label = layout === "icons" ? `<span class="sr-only">${escapeHtml(provider.label)}</span>` : escapeHtml(provider.label);

    return Button({
      variant: "outline",
      attributes: { ...provider.attributes, type: "button", "data-provider": provider.id },
      children: [icon, label],
    });
  });
}

function providersFieldClass(layout: LoginProviderLayout, count: number): string {
  if (layout !== "icons") return loginProviderLayoutTw[layout];
  return cn(loginProviderLayoutTw.icons, loginIconColumnsTw[Math.min(Math.max(count, 1), 4)]);
}

function renderCover(src?: string, alt = ""): string {
  const content = src
    ? `<img src="${escapeHtml(safeUrl(src))}" alt="${escapeHtml(alt)}" class="${escapeHtml(loginCoverImageTw)}">`
    : `<div class="${escapeHtml(loginCoverFallbackTw)}" aria-hidden="true"></div>`;
  return `<div data-slot="login-cover" class="${escapeHtml(loginCoverTw)}">${content}</div>`;
}

/** Markenzeile mit Logo und Name */
export function LoginBrand(args: LoginBrandArgs): string {
  const logo = args.logo
    ? `<div class="${escapeHtml(loginBrandLogoTw)}"><span class="inline-flex size-4 items-center justify-center [&>svg]:size-full" aria-hidden="true">${args.logo}</span></div>`
    : "";

  return `<a href="${escapeHtml(safeUrl(args.href ?? "#"))}" data-slot="login-brand" class="${escapeHtml(cn(loginBrandTw, args.class))}">${logo}${escapeHtml(args.name)}</a>`;
}

/**
 * Anmeldeformular mit E-Mail, Passwort und optionalen Anmelde-Anbietern.
 * Aufbau über `variant` ("card", "plain", "split"), Anbieter über `providers`, `providerLayout`, `providersPosition`.
 */
export function LoginForm(args: LoginFormArgs = {}): string {
  const variant = args.variant ?? "card";
  const labels: Required<LoginLabels> = { ...defaultLabels, ...args.labels };
  const idPrefix = args.idPrefix ?? "login";
  const showPassword = args.showPassword ?? true;
  const errors = args.errors ?? {};
  const providers = args.providers ?? [];
  const providerLayout = args.providerLayout ?? "stack";
  const providersPosition = args.providersPosition ?? "bottom";
  const separatorText = args.separatorText;
  const title = args.title ?? "Willkommen zurück";
  const showSignUp = args.showSignUp ?? true;
  const signUpPosition = args.signUpPosition ?? "footer";
  const centered = args.headerAlign === "center";

  const emailId = `${idPrefix}-email`;
  const passwordId = `${idPrefix}-password`;

  const signUp = showSignUp
    ? FieldDescription({
        class: signUpPosition === "footer" ? "text-center" : undefined,
        children: `${escapeHtml(labels.signUpQuestion)} ${link(args.signUpHref ?? "#", labels.signUp)}`,
      })
    : "";

  const emailField = Field({
    invalid: Boolean(errors.email),
    children: [
      FieldLabel({ for: emailId, children: escapeHtml(labels.email) }),
      Input({
        attributes: {
          id: emailId,
          name: "email",
          type: "email",
          placeholder: labels.emailPlaceholder,
          autocomplete: "email",
          required: true,
          value: args.values?.email,
          "aria-invalid": errors.email ? "true" : undefined,
        },
      }),
      renderFieldError(errors.email),
    ],
  });

  const passwordField = showPassword
    ? Field({
        invalid: Boolean(errors.password),
        children: [
          `<div class="flex items-center">${FieldLabel({ for: passwordId, children: escapeHtml(labels.password) })}${link(
            args.forgotPasswordHref ?? "#",
            labels.forgotPassword,
            cn(loginLinkTw, "ml-auto"),
          )}</div>`,
          Input({
            attributes: {
              id: passwordId,
              name: "password",
              type: "password",
              autocomplete: "current-password",
              required: true,
              "aria-invalid": errors.password ? "true" : undefined,
            },
          }),
          renderFieldError(errors.password),
        ],
      })
    : "";

  const submitButton = Button({ attributes: { type: "submit" }, children: escapeHtml(labels.submit) });
  const providerButtons = renderProviders(providers, providerLayout);
  const hasProviders = providerButtons.length > 0;
  const separator = separatorText && hasProviders ? FieldSeparator({ class: loginSeparatorTw, children: escapeHtml(separatorText) }) : "";
  const providersField = hasProviders
    ? Field({ class: providersFieldClass(providerLayout, providerButtons.length), children: providerButtons })
    : "";

  const footerSignUp = signUpPosition === "footer" ? signUp : "";

  // Aufbau der Abschnitte nach Position der Anbieter
  let sections: string[];
  if (providersPosition === "top") {
    sections = [providersField, separator, emailField, passwordField, Field({ children: [submitButton, footerSignUp] })];
  } else if (!separator && providerLayout === "stack") {
    // wie login-01: Anmelden, Anbieter und Hinweis stehen eng beieinander in einem Field
    sections = [emailField, passwordField, Field({ children: [submitButton, ...providerButtons, footerSignUp] })];
  } else {
    sections = [emailField, passwordField, Field({ children: submitButton }), separator, providersField, footerSignUp];
  }

  const formError = errors.form ? FieldError({ children: escapeHtml(errors.form) }) : "";

  // Kopf im Formular (ohne Karte oder mit Bildspalte); bei "card" steht der Kopf in CardHeader
  const logoLink = args.logo
    ? `<a href="#" class="flex flex-col items-center gap-2 font-medium"><div class="flex size-8 items-center justify-center rounded-md"><span class="inline-flex size-6 items-center justify-center [&>svg]:size-full" aria-hidden="true">${args.logo}</span></div><span class="sr-only">${escapeHtml(args.brand ?? "")}</span></a>`
    : "";
  const inlineHeader =
    variant === "card"
      ? ""
    : `<div class="${escapeHtml(loginHeaderTw)}">${logoLink}<h1 class="text-2xl font-bold">${escapeHtml(title)}</h1>${
        args.description ? `<p class="text-balance text-muted-foreground">${escapeHtml(args.description)}</p>` : ""
      }${signUpPosition === "header" ? signUp : ""}</div>`;

  const formAttrs: HtmlAttributes = {
    ...args.attributes,
    method: args.method ?? "post",
    class: variant === "split" ? "p-6 md:p-8" : undefined,
  };
  if (args.action) formAttrs.action = args.action;

  const form = `<form${renderAttributes(formAttrs)}>${FieldGroup({
    children: [inlineHeader, formError, ...sections],
  })}</form>`;

  const terms = args.showTerms
    ? FieldDescription({
        class: loginTermsTw,
        children: `${escapeHtml(labels.termsBefore)} ${link(args.termsHref ?? "#", labels.terms)} ${escapeHtml(labels.termsAnd)} ${link(
          args.privacyHref ?? "#",
          labels.privacy,
        )} ${escapeHtml(labels.termsAfter)}`,
      })
    : "";

  let body: string;
  if (variant === "card") {
    body = Card({
      children: [
        CardHeader({
          class: centered ? "text-center" : undefined,
          children: [
            CardTitle({ class: centered ? "text-xl" : undefined, children: escapeHtml(title) }),
            args.description ? CardDescription({ children: escapeHtml(args.description) }) : "",
          ],
        }),
        CardContent({ children: form }),
      ],
    });
  } else if (variant === "split") {
    body = Card({
      class: "overflow-hidden p-0",
      children: CardContent({
        class: "grid p-0 md:grid-cols-2",
        children: [form, renderCover(args.imageSrc, args.imageAlt)],
      }),
    });
  } else {
    body = form;
  }

  return `<div data-slot="login-form" data-variant="${variant}" class="${escapeHtml(cn(loginFormTw, args.class))}">${body}${terms}</div>`;
}

/** Seitenlayout um ein Formular: "centered", "muted", "split" (mit Bild rechts) oder "wide" (für `variant: "split"`) */
export function LoginPage(args: LoginPageArgs = {}): string {
  const layout = args.layout ?? "centered";
  const content = renderChildren(args.children);
  const brand = (className?: string): string =>
    args.brand ? LoginBrand({ name: args.brand, logo: args.logo, class: className }) : "";

  let inner: string;
  let rootClass: string;

  switch (layout) {
    case "muted":
      rootClass = tw`flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10`;
      inner = `<div class="flex w-full max-w-sm flex-col gap-6">${brand("self-center")}${content}</div>`;
      break;
    case "split":
      rootClass = tw`grid min-h-svh lg:grid-cols-2`;
      inner = `<div class="flex flex-col gap-4 p-6 md:p-10"><div class="flex justify-center gap-2 md:justify-start">${brand()}</div><div class="flex flex-1 items-center justify-center"><div class="w-full max-w-xs">${content}</div></div></div><div class="${escapeHtml(loginPageCoverTw)}">${
        args.imageSrc
          ? `<img src="${escapeHtml(safeUrl(args.imageSrc))}" alt="${escapeHtml(args.imageAlt ?? "")}" class="${escapeHtml(loginCoverImageTw)}">`
          : `<div class="${escapeHtml(loginCoverFallbackTw)}" aria-hidden="true"></div>`
      }</div>`;
      break;
    case "wide":
      rootClass = tw`flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10`;
      inner = `<div class="w-full max-w-sm md:max-w-4xl">${content}</div>`;
      break;
    default:
      rootClass = tw`flex min-h-svh w-full items-center justify-center p-6 md:p-10`;
      inner = `<div class="w-full max-w-sm">${content}</div>`;
  }

  const attrs: HtmlAttributes = {
    ...args.attributes,
    "data-slot": "login-page",
    "data-layout": layout,
    class: cn(rootClass, args.class),
  };

  return `<div${renderAttributes(attrs)}>${inner}</div>`;
}
