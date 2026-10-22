# LunarEclipse

[![GitHub contributors][contributors-badge]][contributors-url]
[![GitHub repo size][repo-size-badge]][repo-size-url]
[![Discord][discord-badge]][discord-url]

## Allgemein

Tauchen Sie ein in eine fesselnde mittelalterliche Fantasiewelt, in der Sie als Spieler ein abwechslungsreiches RPG-Browsergame mit Wirtschaftssimulation erleben. Reisen Sie, treiben Sie Handel, bauen Sie Städte und kämpfen Sie in dieser epischen Saga, die Ihnen die Freiheit gibt, die Spielwelt auf eigene Faust zu erleben.

## Architektur und Projektstruktur

LunarEclipse ist als Monorepo auf Basis von [Turborepo](https://turbo.build/repo) organisiert. Die Projektstruktur kombiniert Clean Architecture und Vertical Slice Architecture. Eigenständige Anwendungen, gemeinsame technische Bibliotheken und fachliche Features werden in separaten Bereichen verwaltet.

### Projektübersicht

```text
LunarEclipse/
├── apps/
│   ├── bot/           # Discord-Bot (discord.js)
│   ├── web/           # Browsergame (Hono + Datastar)
│   ├── api/           # Daten-API (Hono)
│   └── knowledge/     # Internes Wiki (im Aufbau)
├── packages/
│   ├── design/        # UI-Bibliothek (Tailwind CSS + Storybook)
│   ├── logging/       # Zentrales Logging (Winston)
│   ├── database/      # DataSources und Drizzle-Implementierung
│   ├── features/      # Fachliche Logik und Domain-Features
│   └── i18n/          # Internationalisierung (i18next)
├── config/            # Gemeinsame Konfigurationen
└── docs/
    └── decisions/     # Architectural Decision Records (ADRs)
```

### Anwendungen (`apps/`)

| Anwendung | Beschreibung |
|---|---|
| `apps/bot` | Discord-Bot auf Basis von discord.js. |
| `apps/web` | Browsergame mit Hono als Webframework und Datastar für die Benutzeroberfläche. |
| `apps/api` | Eigenständige Daten-API auf Basis von Hono. |
| `apps/knowledge` | Internes Wiki, das sich noch im Aufbau befindet. |

### Gemeinsame Packages (`packages/`)

| Package | Beschreibung |
|---|---|
| `packages/design` | Gemeinsame UI-Bibliothek und Design-System mit Tailwind CSS. Storybook unterstützt die Entwicklung und Dokumentation der Komponenten. |
| `packages/logging` | Zentrale Logging-Bibliothek auf Basis von Winston. |
| `packages/database` | Kapselt den Datenzugriff über DataSources und Implementierungen mit Drizzle ORM. |
| `packages/features` | Enthält die fachliche Logik und Domain-Features, organisiert nach fachlichen Verantwortlichkeiten. |
| `packages/i18n` | Gemeinsame Internationalisierung und Übersetzungen mit i18next. |

### Zentrale Konfiguration (`config/`)

Das Verzeichnis enthält gemeinsame Konfigurationen für mehrere Anwendungen und Packages. Dazu gehören aktuell die TypeScript-Compiler-Konfigurationen und die ESLint-Regeln.

### Architekturentscheidungen

Grundlegende Architekturentscheidungen werden als **Architectural Decision Records (ADRs)** dokumentiert. Sie beschreiben den jeweiligen Kontext, die getroffene Entscheidung und deren Konsequenzen.

Die Dokumente befinden sich unter [`docs/decisions/`](docs/decisions/).

Eine Übersicht aller Entscheidungen findet sich in [`docs/decisions/README.md`](docs/decisions/README.md).

## Mitmachen und seinen Teil beitragen

[![GitHub Issues or Pull Requests by label](https://img.shields.io/github/issues/Equindar/LunarEclipse/good-first-issue?logo=github)][search-good-first-issue]
[![GitHub Issues or Pull Requests by label](https://img.shields.io/github/issues/Equindar/LunarEclipse/help-wanted?logo=github)][search-help-wanted]

:+1::tada: **Erst einmal danke für dein Interesse und den Willen, sich einzubringen!** :tada::+1:

Die Kommunikation erfolgt direkt über [Discord][discord-url]. Wer will, kann sich dort auch entsprechend seiner Interessen die Rollen zuweisen und das Projekt mitverfolgen.

Schau Dir doch zunächst die „Good-First-Issue”- und „Help-Wanted”-Issues an oder erstelle ein [Issue](https://github.com/Equindar/LunarEclipse/issues/new/choose), wenn du bereits sicher weisst, was benötigt wird.

[contributors-badge]: https://img.shields.io/github/contributors/Equindar/LunarEclipse.svg
[contributors-url]: https://GitHub.com/dotnet/docs/graphs/contributors/
[discord-badge]: https://img.shields.io/discord/627529082246135808?logo=discord&logoColor=white&label=Discord&color=blue
[discord-url]: https://discord.gg/Whmy5SDpsU
[repo-size-badge]: https://img.shields.io/github/repo-size/Equindar/LunarEclipse
[repo-size-url]: https://github.com/Equindar/LunarEclipse
[search-good-first-issue]: https://github.com/Equindar/LunarEclipse/issues?q=is%3Aopen+label%3Agood-first-issue
[search-help-wanted]: https://github.com/Equindar/LunarEclipse/issues?q=is%253Aopen+label%253Ahelp-wanted
