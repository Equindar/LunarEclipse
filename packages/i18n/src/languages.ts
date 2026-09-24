export const supportedLanguages = ['de', 'en'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
export const fallbackLanguage: SupportedLanguage = 'en';

export function toSupportedLanguage(input: string): SupportedLanguage {
  return (supportedLanguages as readonly string[]).includes(input)
    ? (input as SupportedLanguage)
    : fallbackLanguage;
}
