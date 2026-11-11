import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

/** Signal-State eines Dialogs */
export interface DialogSignals {
  /** Ob der Dialog geöffnet ist (wird mit dem nativen dialog-Element synchronisiert) */
  open: boolean;
}

export interface DialogArgs {
  /** Pflicht: ID des Dialogs. Trigger (dialogId) und Content (id) müssen denselben Wert verwenden */
  id: string;
  /** Ob der Dialog initial geöffnet ist (Standard: false) */
  open?: boolean;
  class?: string;
  attributes?: HtmlAttributes;
  /** Trigger und Content */
  children?: Children;
}

export interface DialogTriggerArgs {
  /** Pflicht: ID des Dialogs, der geöffnet wird */
  dialogId: string;
  class?: string;
  attributes?: HtmlAttributes;
  /** Beliebiges Trigger-Markup, meist ein Button (Wrapper statt asChild) */
  children?: Children;
}

export interface DialogContentArgs {
  /** Pflicht: muss mit DialogArgs.id übereinstimmen, wird zur ID des dialog-Elements */
  id: string;
  class?: string;
  /** Ob der Schließen-Button oben rechts angezeigt wird (Standard: true) */
  showCloseButton?: boolean;
  /** Beschriftung für Screenreader am Schließen-Button (Standard: "Close") */
  closeLabel?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface DialogCloseArgs {
  class?: string;
  attributes?: HtmlAttributes;
  /** Beliebiges Markup, das beim Klick den umgebenden Dialog schließt, meist ein Button (Wrapper statt asChild) */
  children?: Children;
}

export interface DialogHeaderArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface DialogFooterArgs {
  class?: string;
  /** Ob ein zusätzlicher "Close"-Button am Ende angezeigt wird (Standard: false) */
  showCloseButton?: boolean;
  /** Beschriftung des zusätzlichen Buttons (Standard: "Close") */
  closeLabel?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface DialogTitleArgs {
  /** ID des Dialogs. Wenn gesetzt, bekommt der Titel die ID für aria-labelledby des Contents */
  dialogId?: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface DialogDescriptionArgs {
  /** ID des Dialogs. Wenn gesetzt, bekommt die Beschreibung die ID für aria-describedby des Contents */
  dialogId?: string;
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}
