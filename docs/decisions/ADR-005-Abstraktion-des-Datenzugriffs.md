# ADR-005: Abstraktion des Datenzugriffs

- **Status:** Vorgeschlagen
- **Datum:** 2026-10-22
- **Entscheidungsverantwortliche:** [ToDo]

## Kontext

LunarEclipse verwendet Drizzle ORM für den Zugriff auf die Datenbank. Die Datenbankintegration wird im Package `packages/database` organisiert.

Die fachlichen Features benötigen Zugriff auf gespeicherte Daten, sollen dabei jedoch nicht unmittelbar von konkreten Datenbankbibliotheken oder deren Implementierungsdetails abhängig sein.

Dafür werden DataSources und konkrete Implementierungen verwendet. Die genaue Abgrenzung zwischen den fachlichen Datenzugriffsverträgen und den technischen Implementierungen muss einheitlich geregelt werden.

## Entscheidungskriterien

- Fachliche Logik soll unabhängig von Drizzle ORM bleiben.
- Datenzugriff soll über definierte Schnittstellen erfolgen.
- Die konkrete Datenbankimplementierung soll austauschbar sein, soweit die fachlichen Anforderungen dies erlauben.
- Datenzugriffslogik soll isoliert testbar sein.
- Zusätzliche Abstraktionsebenen ohne eigenständige Verantwortung sollen vermieden werden.

## Betrachtete Alternativen

### Alternative 1: DataSources mit getrennten Verträgen und Implementierungen

**Vorteile:**
- Fachliche Module können gegen definierte Schnittstellen arbeiten.
- Konkrete Datenbankimplementierungen bleiben austauschbar.
- Tests können alternative Implementierungen oder Test-Doubles verwenden.

**Nachteile:**
- Schnittstellen und Implementierungen müssen getrennt gepflegt werden.
- Änderungen an den Datenzugriffsverträgen können mehrere Module betreffen.
- Eine zu feingranulare Aufteilung kann zusätzlichen Verwaltungsaufwand verursachen.

### Alternative 2: Direkter Datenbankzugriff aus den Features

**Vorteile:**
- Weniger Abstraktionen und geringerer anfänglicher Implementierungsaufwand.
- Drizzle-Funktionen können direkt genutzt werden.

**Nachteile:**
- Fachliche Logik wird unmittelbar an die Datenbankbibliothek gekoppelt.
- Datenzugriff lässt sich schwerer unabhängig testen.
- Ein Wechsel der Datenbanktechnologie kann Änderungen an den Features erfordern.

### Alternative 3: Generisches Repository für sämtliche Datenzugriffe

**Vorteile:**
- Wiederkehrende CRUD-Operationen können vereinheitlicht werden.
- Ein generisches Zugriffsmuster kann für einfache Datenmodelle nützlich sein.

**Nachteile:**
- Fachliche Abfragen und komplexere Anwendungsfälle passen nicht immer in ein einheitliches generisches Muster.
- Zusätzliche Abstraktionen können die tatsächlichen Datenbankoperationen verschleiern.
- Das Modell kann mehr Komplexität erzeugen, als es reduziert.

## Entscheidung

Der Datenzugriff wird im Package `packages/database` zentral organisiert. Die fachlichen Features sollen nicht direkt von Drizzle ORM abhängen.

DataSources stellen die benötigten Datenzugriffsverträge bereit. Konkrete Implementierungen erfüllen diese Verträge und verwenden Drizzle ORM für die Datenbankkommunikation.

Dabei gelten folgende Regeln:

1. Fachliche Features greifen über definierte Datenzugriffsverträge auf benötigte Daten zu.
2. Die konkreten Implementierungen der Datenzugriffe verwenden Drizzle ORM und bleiben von den fachlichen Verträgen getrennt.
3. Datenbankbezogene Details wie ORM-Abfragen und Tabellenstrukturen sollen nicht unnötig in die fachlichen Modelle gelangen.
4. Datenzugriffsverträge orientieren sich an den fachlichen Anforderungen und nicht ausschließlich an den CRUD-Operationen der Datenbank.
5. Zusätzliche Abstraktionsebenen werden nur eingeführt, wenn sie eine klar definierte Verantwortung besitzen.

Die genaue technische Ausgestaltung der DataSources, ihrer Verträge und ihrer Implementierungen wird ergänzend festgelegt.

## Konsequenzen

### Positive Konsequenzen

- Fachliche Features bleiben von Drizzle ORM entkoppelt.
- Datenzugriffe können unabhängig von der konkreten Implementierung getestet werden.
- Datenbankbezogene Änderungen lassen sich auf die zuständigen Infrastrukturkomponenten begrenzen.
- Die Architektur unterstützt eine klare Trennung zwischen fachlicher Verantwortung und technischer Persistenz.

### Negative Konsequenzen

- Datenzugriffsverträge und ihre Implementierungen verursachen zusätzlichen Entwicklungsaufwand.
- Schnittstellen müssen bei Änderungen fachlicher Anforderungen gepflegt werden.
- Nicht jede Änderung der Datenbank kann vollständig ohne Anpassung der Verträge umgesetzt werden.

## Offene Punkte

- [ToDo: verbindliche Schnittstellen für DataSources und deren Implementierungen festlegen.]
- [ToDo: entscheiden, ob die Datenzugriffsverträge innerhalb der Features oder zentral in `packages/database` definiert werden.]
- [ToDo: Rückgabeformate, Fehlerbehandlung und Umgang mit fehlenden Datensätzen festlegen.]
- [ToDo: Regeln für Transaktionen und mehrere zusammengehörige Datenbankoperationen definieren.]
- [ToDo: festlegen, wie Datenbankmodelle in fachliche Modelle überführt werden.]
- [ToDo: Teststrategie für Datenzugriffsimplementierungen und Integrationstests definieren.]

## Verknüpfungen

- [ADR-002: Clean Architecture](ADR-002-Clean-Architecture.md)
- [ADR-003: Vertical Slice Architecture](ADR-003-Vertical-Slice-Architecture.md)
- [ADR-004: Gemeinsame Packages](ADR-004-Gemeinsame-Packages.md)
