import type { Children } from "../../types/Children";
import type { HtmlAttributes } from "../../utils/renderHtmlAttributes";

export interface CheckboxArgs {
  id: string;
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  class?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  attributes?: HtmlAttributes;
}

export interface CheckboxIndicatorArgs {
  class?: string;
  attributes?: HtmlAttributes;
  children?: Children;
}

export interface CheckboxSignals {
  checked: boolean;
  disabled: boolean;
}
