# ADR-002: Clean Architecture

- **Status:** Vorgeschlagen
- **Datum:** 2026-10-22
- **Entscheidungsverantwortliche:** [ToDo]

## Kontext

LunarEclipse umfasst mehrere Anwendungen und fachliche Funktionen. Die fachlichen Regeln des Spiels sollen nicht unmittelbar von Webframeworks, Datenbanken oder anderen technischen Implementierungen abhängen.

Insbesondere werden Hono für die HTTP-Kommunikation, Drizzle ORM für den Datenzugriff und weitere Bibliotheken für technische Aufgaben eingesetzt. Diese Technologien können sich im Laufe der Entwicklung ändern.

Ohne klare Abhängigkeitsregeln besteht das Risiko, dass fachliche Logik mit technischen Details vermischt wird und dadurch schwerer testbar und wiederverwendbar wird.

## Entscheidungskriterien

- Fachliche Regeln sollen unabhängig von konkreten technischen Implementierungen bleiben.
- Abhängigkeiten zwischen fachlicher Logik und Infrastruktur sollen explizit und kontrollierbar sein.
- Die fachliche Logik soll ohne laufende Webserver oder echte Datenbank testbar sein.
- Technische Implementierungen sollen austauschbar sein, ohne die fachlichen Regeln grundlegend umzubauen.

## Betrachtete Alternativen

### Alternative 1: Clean Architecture

**Vorteile:**
- Definierte Abhängigkeitsrichtung zwischen fachlichen und technischen Bestandteilen.
- Fachliche Logik kann unabhängig von Infrastruktur getestet werden.
- Technische Implementierungen lassen sich über Abstraktionen austauschen.

**Nachteile:**
- Schnittstellen und Abstraktionen verursachen zusätzlichen Entwicklungsaufwand.
- Bei zu kleinteiliger Anwendung kann unnötige Komplexität entstehen.

### Alternative 2: Technisch geschichtete Architektur ohne verbindliche Abhängigkeitsregeln

**Vorteile:**
- Einfacher Einstieg und geringe Anfangskomplexität.
- Direkte Verwendung von Frameworks und Datenbankbibliotheken ist unkompliziert.

**Nachteile:**
- Fachliche Logik kann an konkrete Infrastruktur gebunden werden.
- Änderungen an technischen Bibliotheken können fachliche Module betreffen.
- Isolierte Tests können aufwendiger werden.

## Entscheidung

LunarEclipse orientiert sich an den Prinzipien der Clean Architecture.

Die fachliche Logik wird von der technischen Infrastruktur getrennt. Abhängigkeiten sollen grundsätzlich von äußeren technischen Schichten in Richtung der fachlichen Regeln verlaufen, nicht umgekehrt.

Daraus ergeben sich folgende Regeln:

1. Fachliche Modelle und Geschäftsregeln sollen keine direkten Abhängigkeiten zu Hono, Drizzle ORM oder anderen Infrastrukturimplementierungen besitzen.
2. Die fachliche Logik definiert bei Bedarf die benötigten Verträge und Schnittstellen.
3. Technische Implementierungen erfüllen diese Verträge und werden von den Anwendungen oder einem geeigneten Zusammensetzungsbereich bereitgestellt.
4. HTTP-Routen, Controller und Framework-spezifische Verarbeitung gehören in die jeweiligen Anwendungen und nicht in die fachlichen Features.
5. Fachliche Regeln sollen möglichst unabhängig von externen Systemen getestet werden können.

Die konkrete Abgrenzung zwischen Domain-Modellen, Anwendungsfällen und Infrastruktur wird anhand der jeweiligen Features umgesetzt.

## Konsequenzen

### Positive Konsequenzen

- Die fachliche Logik bleibt von technischen Implementierungen entkoppelt.
- Datenbank- und Framework-Wechsel können gezielter durchgeführt werden.
- Fachliche Tests benötigen weniger externe Infrastruktur.
- Gemeinsame fachliche Funktionen können von mehreren Anwendungen verwendet werden.

### Negative Konsequenzen

- Zusätzliche Schnittstellen und Implementierungen müssen gepflegt werden.
- Die Zusammensetzung der Anwendungen benötigt klare Zuständigkeiten.
- Zu weitgehende Abstraktionen können die Lesbarkeit und Wartbarkeit beeinträchtigen.

## Offene Punkte

- [ToDo: verbindliche Definition der fachlichen und technischen Schichten innerhalb von `packages/features` festlegen.]
- [ToDo: Regeln für Domain-Events, Anwendungsfälle und Transaktionsgrenzen definieren.]
- [ToDo: festlegen, wo Abhängigkeiten und Implementierungen beim Start der Anwendungen zusammengesetzt werden.]

## Verknüpfungen

- [ADR-001: Monorepo mit Turborepo](ADR-001-Monorepo-mit-Turborepo.md)
- [ADR-003: Vertical Slice Architecture](ADR-003-Vertical-Slice-Architecture.md)
- [ADR-005: Abstraktion des Datenzugriffs](ADR-005-Abstraktion-des-Datenzugriffs.md)
