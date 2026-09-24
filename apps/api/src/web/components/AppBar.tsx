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
            href={`/lang/${l.code}?redirect=${encodeURIComponent(currentPath)}`}
            class={l.code === currentLang ? 'active' : ''}
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
