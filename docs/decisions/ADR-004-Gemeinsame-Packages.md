# ADR-004: Gemeinsame Packages

- **Status:** Vorgeschlagen
- **Datum:** 2026-10-22
- **Entscheidungsverantwortliche:** [ToDo]

## Kontext

Die Anwendungen von LunarEclipse benötigen wiederkehrende technische Funktionen und teilweise gemeinsame fachliche Bausteine. Dazu zählen UI-Komponenten, Logging, Datenzugriff, Internationalisierung und fachliche Features.

Ohne eine zentrale Organisation könnten ähnliche Funktionen in mehreren Anwendungen separat implementiert werden. Dies würde zu doppeltem Wartungsaufwand und möglicherweise unterschiedlichen Implementierungen derselben Funktion führen.

Gleichzeitig dürfen gemeinsam genutzte Packages nicht zu einer unübersichtlichen Sammlung ohne klare Verantwortlichkeiten werden.

## Entscheidungskriterien

- Wiederverwendbare Funktionen sollen zentral gepflegt werden.
- Jedes Package soll eine klar abgegrenzte Verantwortung besitzen.
- Abhängigkeiten zwischen Packages sollen nachvollziehbar bleiben.
- Fachliche Logik soll von technischen Hilfsbibliotheken getrennt sein.
- Packages sollen nur die Abhängigkeiten mitbringen, die sie tatsächlich benötigen.

## Betrachtete Alternativen

### Alternative 1: Gemeinsame Packages im Monorepo

**Vorteile:**
- Gemeinsame Funktionen werden nur einmal implementiert und gepflegt.
- Änderungen können zusammen mit den verwendenden Anwendungen erfolgen.
- Verantwortlichkeiten lassen sich über Package-Grenzen definieren.

**Nachteile:**
- Package-Grenzen und Abhängigkeiten müssen aktiv gepflegt werden.
- Zu viele kleine Packages können unnötigen Verwaltungsaufwand verursachen.
- Änderungen an gemeinsam genutzten Packages können mehrere Anwendungen betreffen.

### Alternative 2: Implementierungen innerhalb jeder Anwendung

**Vorteile:**
- Jede Anwendung kann ihre Implementierung unabhängig gestalten.
- Es entstehen zunächst weniger interne Paketabhängigkeiten.

**Nachteile:**
- Gemeinsame Funktionen können mehrfach implementiert werden.
- Fehlerkorrekturen und Verbesserungen müssen gegebenenfalls mehrfach übernommen werden.
- Einheitliche technische Standards sind schwieriger durchzusetzen.

## Entscheidung

Wiederverwendbare Funktionen werden in eigenständigen Packages unter `packages/` organisiert.

Die Packages besitzen folgende Verantwortlichkeiten:

- `packages/design`: gemeinsame UI-Bibliothek und Design-System mit Tailwind CSS und Storybook.
- `packages/logging`: gemeinsame Logging-Funktionalität auf Basis von Winston.
- `packages/database`: Abstraktionen und Implementierungen für den Datenzugriff mit Drizzle ORM.
- `packages/features`: fachliche Logik und Domain-Features.
- `packages/i18n`: gemeinsame Internationalisierung mit i18next.

Für die Organisation gelten folgende Regeln:

1. Jedes Package besitzt einen klar definierten Verantwortungsbereich.
2. Anwendungen verwenden gemeinsame Packages über definierte Package-Schnittstellen.
3. Packages sollen keine Abhängigkeiten zu Anwendungen besitzen, die sie selbst verwenden.
4. Abhängigkeiten zwischen Packages werden auf das notwendige Maß beschränkt.
5. Fachliche Logik wird nicht allein deshalb in ein technisches Package verschoben, weil sie von mehreren Anwendungen verwendet wird.
6. Anwendungsspezifische Funktionen verbleiben in der jeweiligen Anwendung, solange keine begründete Wiederverwendung erforderlich ist.

Die konkreten Regeln für öffentliche Exporte, interne Imports und Paketversionierung werden ergänzend festgelegt.

## Konsequenzen

### Positive Konsequenzen

- Wiederkehrende technische Funktionen stehen mehreren Anwendungen zur Verfügung.
- Gemeinsame Standards können zentral implementiert werden.
- Die fachlichen und technischen Verantwortlichkeiten sind leichter nachvollziehbar.
- Interne Bibliotheken können gemeinsam mit ihren Verbrauchern weiterentwickelt werden.

### Negative Konsequenzen

- Package-Schnittstellen müssen langfristig gepflegt werden.
- Änderungen an gemeinsamen Packages erfordern gegebenenfalls Tests mehrerer Anwendungen.
- Eine unklare Abgrenzung kann zu unnötigen Abhängigkeiten oder übermäßig allgemeinen Packages führen.

## Offene Punkte

- [ToDo: Regeln für öffentliche Exporte und interne Package-Imports definieren.]
- [ToDo: entscheiden, welche Packages intern bleiben und welche gegebenenfalls separat veröffentlicht werden.]
- [ToDo: Regeln für zirkuläre Abhängigkeiten und deren Prüfung festlegen.]
- [ToDo: Versionierungs- und Kompatibilitätsregeln für gemeinsam genutzte Packages festlegen.]

## Verknüpfungen

- [ADR-001: Monorepo mit Turborepo](ADR-001-Monorepo-mit-Turborepo.md)
- [ADR-002: Clean Architecture](ADR-002-Clean-Architecture.md)
- [ADR-003: Vertical Slice Architecture](ADR-003-Vertical-Slice-Architecture.md)
- [ADR-005: Abstraktion des Datenzugriffs](ADR-005-Abstraktion-des-Datenzugriffs.md)
