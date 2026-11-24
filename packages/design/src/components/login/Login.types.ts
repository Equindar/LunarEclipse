import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Aufbau des Formulars: Karte, ohne Karte oder Karte mit Bildspalte */
export type LoginFormVariant = "card" | "plain" | "split";

/** Darstellung der Anbieter-Buttons: untereinander, zweispaltig mit Text oder nur Icons nebeneinander */
export type LoginProviderLayout = "stack" | "columns" | "icons";

/** Anbieter-Buttons vor (top) oder nach (bottom) der E-Mail-Anmeldung */
export type LoginProvidersPosition = "top" | "bottom";

/** Ausrichtung von Titel und Beschreibung im Kartenkopf */
export type LoginHeaderAlign = "start" | "center";

/** Ort des Hinweises "Noch kein Konto?" */
export type LoginSignUpPosition = "header" | "footer";

/** Seitenlayout um das Formular */
export type LoginPageLayout = "centered" | "muted" | "split" | "wide";

/** Ein Anmelde-Anbieter (z. B. Google) */
export interface LoginProvider {
  /** Kennung, wird als `data-provider` gesetzt */
  id: string;
  /** Beschriftung (bei `icons` nur für Screenreader) */
  label: string;
  /** SVG als HTML-String, z. B. `renderIcon("google")` */
  icon?: string;
  /** Zusätzliche Button-Attribute, z. B. für Datastar (`data-on:click`) */
  attributes?: HtmlAttributes;
}

/** Fehlermeldungen je Feld; `form` erscheint oberhalb der Felder */
export interface LoginFieldErrors {
  form?: string;
  email?: string;
  password?: string;
}

/** Alle Texte der Komponente (Standard: Deutsch) */
export interface LoginLabels {
  email?: string;
  emailPlaceholder?: string;
  password?: string;
  forgotPassword?: string;
  submit?: string;
  signUpQuestion?: string;
  signUp?: string;
  termsBefore?: string;
  terms?: string;
  termsAnd?: string;
  privacy?: string;
  termsAfter?: string;
}

export interface LoginFormArgs {
  /** Zusätzliche CSS-Klassen am Wurzelelement */
  class?: string;
  /** Zusätzliche Attribute am `<form>`, z. B. für Datastar (`data-on:submit`) */
  attributes?: HtmlAttributes;
  /** Aufbau (Standard: "card") */
  variant?: LoginFormVariant;
  /** Titel (Standard: "Willkommen zurück") */
  title?: string;
  /** Beschreibung unter dem Titel */
  description?: string;
  /** Ausrichtung des Kartenkopfs (nur bei `card`, Standard: "start") */
  headerAlign?: LoginHeaderAlign;
  /** Logo als HTML-String im Formularkopf (nur bei `plain` und `split`); `brand` dient als Text für Screenreader */
  logo?: string;
  /** Markenname für das Logo im Formularkopf */
  brand?: string;
  /** Ziel des Formulars */
  action?: string;
  /** Methode des Formulars (Standard: "post") */
  method?: "get" | "post";
  /** Präfix für die IDs der Felder, damit mehrere Formulare auf einer Seite funktionieren (Standard: "login") */
  idPrefix?: string;
  /** Passwortfeld anzeigen (Standard: true); ohne Passwort entsteht die reine E-Mail-Anmeldung */
  showPassword?: boolean;
  /** Link "Passwort vergessen?" (Standard: "#") */
  forgotPasswordHref?: string;
  /** Anmelde-Anbieter */
  providers?: LoginProvider[];
  /** Darstellung der Anbieter (Standard: "stack") */
  providerLayout?: LoginProviderLayout;
  /** Position der Anbieter (Standard: "bottom") */
  providersPosition?: LoginProvidersPosition;
  /** Text auf der Trennlinie zwischen E-Mail-Anmeldung und Anbietern; ohne Text keine Trennlinie */
  separatorText?: string;
  /** Ort des Registrieren-Hinweises (Standard: "footer") */
  signUpPosition?: LoginSignUpPosition;
  /** Registrieren-Hinweis anzeigen (Standard: true) */
  showSignUp?: boolean;
  /** Link "Registrieren" (Standard: "#") */
  signUpHref?: string;
  /** Hinweis auf Nutzungsbedingungen und Datenschutz unter dem Formular (Standard: false) */
  showTerms?: boolean;
  termsHref?: string;
  privacyHref?: string;
  /** Bild der Bildspalte (nur bei `split`); ohne Bild erscheint ein Farbverlauf */
  imageSrc?: string;
  imageAlt?: string;
  /** Fehlermeldungen */
  errors?: LoginFieldErrors;
  /** Vorbelegte Werte */
  values?: { email?: string };
  /** Texte überschreiben */
  labels?: LoginLabels;
}

export interface LoginBrandArgs {
  class?: string;
  /** Name der Marke */
  name: string;
  /** Logo als HTML-String (SVG) */
  logo?: string;
  href?: string;
}

export interface LoginPageArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Seitenlayout (Standard: "centered") */
  layout?: LoginPageLayout;
  /** Inhalt, in der Regel `LoginForm(...)` */
  children?: Children;
  /** Markenname (Layouts "muted" und "split") */
  brand?: string;
  /** Logo als HTML-String (Layouts "muted" und "split") */
  logo?: string;
  /** Bild der rechten Spalte (Layout "split") */
  imageSrc?: string;
  imageAlt?: string;
}
