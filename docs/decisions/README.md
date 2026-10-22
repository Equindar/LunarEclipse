# Architekturentscheidungen

Dieses Verzeichnis dokumentiert die wesentlichen Architekturentscheidungen des Projekts LunarEclipse in Form von Architectural Decision Records (ADRs).

Jeder ADR beschreibt den Kontext einer Entscheidung, die gewählte Lösung, betrachtete Alternativen und die daraus entstehenden Konsequenzen. Dadurch bleiben die Gründe für architektonische Festlegungen nachvollziehbar und spätere Änderungen können auf bestehenden Entscheidungen aufbauen.

## Status

- **📝 Vorgeschlagen:** Die Entscheidung ist dokumentiert, aber noch nicht abschließend bestätigt.
- **✅ Angenommen:** Die Entscheidung wurde bestätigt und ist verbindlich.
- **❌ Abgelehnt:** Die vorgeschlagene Entscheidung wurde verworfen.
- **🗄️ Veraltet:** Die Entscheidung gilt nicht mehr.
- **🔄 Ersetzt:** Die Entscheidung wurde durch einen neueren ADR abgelöst.

Angenommene ADRs werden nicht nachträglich inhaltlich umgeschrieben. Änderungen an einer bestehenden Entscheidung werden in einem neuen ADR dokumentiert, der auf die vorherige Entscheidung verweist.

## Übersicht

| ADR | Entscheidung | Status |
|---|---|---|
| [ADR-001](ADR-001-Monorepo-mit-Turborepo.md) | Monorepo mit Turborepo | 📝 Vorgeschlagen |
| [ADR-002](ADR-002-Clean-Architecture.md) | Clean Architecture | 📝 Vorgeschlagen |
| [ADR-003](ADR-003-Vertical-Slice-Architecture.md) | Vertical Slice Architecture | 📝 Vorgeschlagen |
| [ADR-004](ADR-004-Gemeinsame-Packages.md) | Gemeinsame Packages | 📝 Vorgeschlagen |
| [ADR-005](ADR-005-Abstraktion-des-Datenzugriffs.md) | Abstraktion des Datenzugriffs | 📝 Vorgeschlagen |

## Neue Architekturentscheidung dokumentieren

1. Die Vorlage `ADR-000-Vorlage.md` kopieren.
2. Die nächste freie Nummer und einen aussagekräftigen Dateinamen vergeben.
3. Kontext, Alternativen, Entscheidung und Konsequenzen dokumentieren.
4. Offene Fragen mit `[ToDo]` kennzeichnen.
5. Die Entscheidung vor ihrer Annahme überprüfen und den Status entsprechend aktualisieren.
6. Den neuen ADR in dieser Übersicht ergänzen.
