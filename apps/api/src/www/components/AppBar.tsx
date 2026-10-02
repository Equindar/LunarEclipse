type AppBarProps = {
  currentLang: string;
  currentPath: string;
};

export function AppBar({ currentLang, currentPath }: AppBarProps) {
  const languages = [
    { code: 'de', label: 'DE' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <nav>
      <div class="app-bar">
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
    </nav>
  );
}
