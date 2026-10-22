# ADR-003: Vertical Slice Architecture

- **Status:** Vorgeschlagen
- **Datum:** 2026-10-22
- **Entscheidungsverantwortliche:** [ToDo]

## Kontext

LunarEclipse enthält unterschiedliche fachliche Bereiche des Browsergames. Diese Bereiche besitzen eigene Regeln, Modelle und Anwendungsfälle und können unabhängig voneinander weiterentwickelt werden.

Eine ausschließlich technische Organisation, beispielsweise mit zentralen Verzeichnissen für sämtliche Services, Repositories und Controller, kann dazu führen, dass zusammengehörige fachliche Funktionen über viele Verzeichnisse verteilt sind.

Die fachlichen Bestandteile sollen deshalb nach ihren Verantwortlichkeiten strukturiert werden. Gleichzeitig müssen die Abhängigkeitsregeln der Clean Architecture eingehalten werden.

## Entscheidungskriterien

- Fachlich zusammengehörige Funktionen sollen gemeinsam auffindbar sein.
- Änderungen an einem Feature sollen möglichst wenige unabhängige Features betreffen.
- Fachliche Zuständigkeiten sollen klar abgegrenzt werden.
- Gemeinsame Funktionen sollen bewusst wiederverwendet werden können.
- Die Architektur soll mit der Anzahl der Features wachsen können.

## Betrachtete Alternativen

### Alternative 1: Vertical Slice Architecture

**Vorteile:**
- Zusammengehörige fachliche Funktionen werden gemeinsam organisiert.
- Änderungen lassen sich einem klaren fachlichen Verantwortungsbereich zuordnen.
- Features können unabhängig voneinander entwickelt und getestet werden.

**Nachteile:**
- Gemeinsame Funktionen müssen gezielt identifiziert und abgegrenzt werden.
- Ohne klare Regeln können ähnliche Implementierungen mehrfach entstehen.
- Feature-übergreifende Abhängigkeiten müssen kontrolliert werden.

### Alternative 2: Ausschließlich technische Schichten

**Vorteile:**
- Technische Bestandteile desselben Typs befinden sich an einer zentralen Stelle.
- Für kleine Anwendungen ist die Struktur leicht verständlich.

**Nachteile:**
- Zusammengehörige Funktionen verteilen sich über mehrere technische Verzeichnisse.
- Änderungen an einem Anwendungsfall können mehrere Bereiche betreffen.
- Fachliche Zuständigkeiten sind nicht immer direkt aus der Verzeichnisstruktur erkennbar.

## Entscheidung

Die fachliche Logik wird in `packages/features` nach fachlichen Features und Anwendungsfällen organisiert.

Die Struktur orientiert sich an der Vertical Slice Architecture. Dabei bildet ein fachlicher Verantwortungsbereich den Ausgangspunkt für die Organisation zusammengehöriger Modelle, Regeln und Anwendungsfälle.

Folgende Regeln gelten:

1. Fachliche Features werden nach ihrem fachlichen Zweck und nicht ausschließlich nach ihrem technischen Typ gruppiert.
2. Ein Feature kapselt die zugehörige fachliche Logik und stellt nur die notwendigen Schnittstellen nach außen bereit.
3. Gemeinsam genutzte Funktionen werden nicht automatisch zentralisiert. Eine Wiederverwendung erfolgt dann, wenn eine gemeinsame fachliche oder technische Verantwortung tatsächlich besteht.
4. Technische Ein- und Ausgabepunkte, insbesondere HTTP-Routen und Controller, bleiben in den jeweiligen Anwendungen.
5. Die Abhängigkeitsregeln der Clean Architecture gelten weiterhin. Vertical Slices rechtfertigen keine direkten Abhängigkeiten der Domain von Infrastrukturimplementierungen.

Die konkrete Verzeichnisstruktur eines Features wird anhand seiner fachlichen Anforderungen festgelegt.

## Konsequenzen

### Positive Konsequenzen

- Fachliche Änderungen lassen sich leichter lokalisieren.
- Features können gezielter entwickelt und getestet werden.
- Die Struktur unterstützt die Erweiterung des Spiels um neue fachliche Bereiche.
- Die fachliche Organisation bleibt unabhängig von den konkreten Auslieferungswegen.

### Negative Konsequenzen

- Es werden Regeln zur Abgrenzung und Wiederverwendung von Features benötigt.
- Gemeinsame fachliche Konzepte erfordern eine bewusste Entscheidung über ihre Zuständigkeit.
- Ohne klare Grenzen kann es zu zyklischen oder zu engen Abhängigkeiten zwischen Features kommen.

## Offene Punkte

- [ToDo: verbindliche Namens- und Verzeichnisregeln für Features festlegen.]
- [ToDo: Regeln für featureübergreifende Aufrufe und gemeinsam genutzte Domain-Modelle definieren.]
- [ToDo: festlegen, welche Tests pro Feature verpflichtend sind.]

## Verknüpfungen

- [ADR-001: Monorepo mit Turborepo](ADR-001-Monorepo-mit-Turborepo.md)
- [ADR-002: Clean Architecture](ADR-002-Clean-Architecture.md)
- [ADR-004: Gemeinsame Packages](ADR-004-Gemeinsame-Packages.md)
