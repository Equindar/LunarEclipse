import { Button, DarkModeToggle, Icon } from "@lunareclipse/design";
import { raw } from "hono/html";

type AppBarProps = {
  currentLang: string;
  currentPath: string;
};

export function AppBar({ currentLang, currentPath }: AppBarProps) {
  const languages = [
    { code: 'de', label: 'DE' },
    { code: 'en', label: 'EN' },
  ];

  return(
    <header class="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/70 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/70">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <div class="flex items-center">
          <a href="#" class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Lunar<span class="text-blue-600">Eclipse</span>
          </a>
        </div>

        <nav class="hidden md:flex md:items-center md:space-x-8">
          <a href="/news" class="text-sm font-medium text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Neuigkeiten</a>
          <a href="#" class="text-sm font-medium text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Kontakt</a>
        </nav>

        <div class="hidden md:flex md:items-center">
          {raw(DarkModeToggle({variant: "outline", size: "lg"}))}
          <div>
              {languages.map((l) => (
                <a
                  href={`/language/${l.code}?redirect=${encodeURIComponent(currentPath)}`}
                  class={l.code === currentLang ? 'active' : ''}
                  style="padding: 0 20px;"
                >
                  {l.label}
                </a>
              ))}
            </div>
          {raw(Button({ variant: "default", size: "lg", children: "Anmelden", disabled: true}))}
        </div>

        <div class="flex md:hidden">
          {raw(Button({
            variant: "ghost",
            type: "button",
            size: "lg",
            disabled: true,
            class: "inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100/50 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-800/50",
            children: Icon({ name: "menu"})
          }))}
        </div>
      </div>

      <div id="mobile-menu" class="hidden border-t border-gray-200/80 bg-white/95 backdrop-blur-md md:hidden dark:border-gray-800/80 dark:bg-gray-950/95">
        <div class="space-y-1 px-4 pt-2 pb-4">
          <a href="/news" class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/80">Neuigkeiten</a>
          <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/80">Kontakt</a>
          <div class="pt-2">
            <a href="#" class="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-base font-medium text-white hover:bg-blue-700">
              Loslegen
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
