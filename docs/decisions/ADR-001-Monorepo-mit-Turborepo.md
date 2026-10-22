# ADR-001: Monorepo mit Turborepo

- **Status:** Vorgeschlagen
- **Datum:** 2026-10-22
- **Entscheidungsverantwortliche:** [ToDo]

## Kontext

LunarEclipse besteht aus mehreren eigenständigen Anwendungen und gemeinsam genutzten Packages. Dazu gehören ein Discord-Bot, das Browsergame, eine Daten-API und ein internes Wiki sowie Bibliotheken für Design, Logging, Datenzugriff, fachliche Logik und Internationalisierung.

Die Anwendungen verwenden teilweise dieselben technischen Bibliotheken und Konfigurationen. Eine getrennte Verwaltung in einzelnen Repositories würde die gemeinsame Entwicklung und Versionierung dieser Bestandteile erschweren.

Gleichzeitig sollen die Anwendungen eigene Verantwortlichkeiten und ausführbare Einstiegspunkte behalten.

## Entscheidungskriterien

- Gemeinsame Verwaltung von Anwendungen und Packages in einem Repository.
- Wiederverwendung interner Bibliotheken ohne separate Veröffentlichung.
- Einheitliche Entwicklungs- und Build-Konfigurationen.
- Unterstützung voneinander unabhängiger Anwendungen.
- Nachvollziehbare Abhängigkeiten und ausführbare Aufgaben im gesamten Repository.

## Betrachtete Alternativen

### Alternative 1: Monorepo mit Turborepo

**Vorteile:**
- Anwendungen und Packages werden gemeinsam versioniert.
- Interne Packages können über den Workspace direkt referenziert werden.
- Turborepo unterstützt die Orchestrierung von Skripten und die Zwischenspeicherung von Build-Ergebnissen.
- Änderungen an gemeinsam genutzten Bibliotheken können zusammen mit ihren Verbrauchern entwickelt werden.

**Nachteile:**
- Die Repository-Konfiguration und Abhängigkeitsverwaltung werden komplexer.
- Build-Aufgaben und Paketabhängigkeiten müssen korrekt definiert werden.
- Gemeinsame Änderungen können mehrere Anwendungen gleichzeitig betreffen.

### Alternative 2: Mehrere getrennte Repositories

**Vorteile:**
- Jedes Projekt besitzt eine vollständig getrennte Versionsverwaltung.
- Zugriffsrechte, Veröffentlichungen und Entwicklungsabläufe können unabhängig gestaltet werden.

**Nachteile:**
- Gemeinsame Bibliotheken benötigen zusätzliche Veröffentlichungs- und Versionsverwaltungsprozesse.
- Änderungen über Repository-Grenzen hinweg sind aufwendiger.
- Entwicklungs- und Konfigurationsaufwand kann mehrfach anfallen.

## Entscheidung

LunarEclipse wird als Monorepo mit Turborepo und pnpm Workspaces organisiert.

Die Verzeichnisstruktur folgt drei grundlegenden Bereichen:

- `apps/` enthält eigenständige Anwendungen.
- `packages/` enthält gemeinsam genutzte Bibliotheken und fachliche Module.
- `config/` enthält zentrale Konfigurationen für mehrere Anwendungen und Packages.

Die aktuell vorgesehenen Anwendungen sind:

- `apps/bot`: Discord-Bot mit discord.js.
- `apps/web`: Browsergame mit Hono und Datastar.
- `apps/api`: Daten-API mit Hono.
- `apps/knowledge`: internes Wiki, noch im Aufbau.

Die gemeinsam genutzten Packages umfassen `design`, `logging`, `database`, `features` und `i18n`.

## Konsequenzen

### Positive Konsequenzen

- Gemeinsame Bibliotheken können direkt innerhalb des Repositories verwendet werden.
- Änderungen an mehreren Anwendungen lassen sich in einem gemeinsamen Commit nachvollziehen.
- Wiederkehrende Konfigurationen können zentral gepflegt werden.
- Turborepo kann Build- und Entwicklungsaufgaben anhand des definierten Abhängigkeitsgraphen orchestrieren.

### Negative Konsequenzen

- Das Repository benötigt eine sorgfältig gepflegte Workspace- und Aufgaben-Konfiguration.
- Fehlerhafte Paketabhängigkeiten können mehrere Anwendungen betreffen.
- Nicht alle Anwendungen müssen dieselben Build- oder Testaufgaben ausführen; die Pipeline muss dies berücksichtigen.

## Offene Punkte

- [ToDo: verbindliche pnpm- und Node.js-Versionen festlegen.]
- [ToDo: Regeln für interne Paketversionierung und Veröffentlichungen definieren.]
- [ToDo: CI/CD-Strategie für anwendungsspezifische Builds und Deployments dokumentieren.]

## Verknüpfungen

- [ADR-002: Clean Architecture](ADR-002-Clean-Architecture.md)
- [ADR-003: Vertical Slice Architecture](ADR-003-Vertical-Slice-Architecture.md)
- [ADR-004: Gemeinsame Packages](ADR-004-Gemeinsame-Packages.md)
