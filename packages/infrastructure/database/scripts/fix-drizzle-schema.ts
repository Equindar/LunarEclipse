import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Bereinigt bekannte Introspection-Bugs von drizzle-kit bei MySQL/MariaDB:
 *
 *  1. `.default('NULL')`  -> wird komplett entfernt (redundant bei nullable Spalten,
 *     verursacht sonst TS2345 bei int/bigint/decimal/etc.)
 *  2. `.default('current_timestamp()')` -> wird zu `.default(sql\`CURRENT_TIMESTAMP\`)`
 *     umgeschrieben (sonst wird der Literal-String statt der SQL-Funktion gespeichert).
 *     Fügt bei Bedarf automatisch `import { sql } from 'drizzle-orm';` hinzu.
 *
 * Nutzung:
 *   ts-node fix-drizzle-schema.ts [pfad/zur/schema.ts]
 *
 * Standardpfad, falls kein Argument übergeben wird: ./src/db/schema.ts
 */

const targetPath = resolve(process.argv[2] ?? './src/db/schema.ts');

const main = async () => {
  if (!existsSync(targetPath)) {
    throw new Error(
      `Datei nicht gefunden: ${targetPath}\nNutzung: ts-node fix-drizzle-schema.ts [pfad/zur/schema.ts]`,
    );
  }

  const original = await readFile(targetPath, 'utf8');
  let content = original;

  let removedNullDefaults = 0;
  let fixedTimestampDefaults = 0;
  let fixedQuotedDefaults = 0;

  // 1. .default('NULL') entfernen (egal ob ' oder ")
  content = content.replace(/\.default\((['"])NULL\1\)/g, () => {
    removedNullDefaults += 1;
    return '';
  });

  // 2. .default('current_timestamp()') -> .default(sql`CURRENT_TIMESTAMP`)
  content = content.replace(/\.default\((['"])current_timestamp\(\)\1\)/gi, () => {
    fixedTimestampDefaults += 1;
    return '.default(sql`CURRENT_TIMESTAMP`)';
  });

  // 3. .default('\'Draft\'') -> .default('Draft')
  //    drizzle-kit liest den Default teils bereits inkl. Anführungszeichen aus
  //    information_schema und wickelt ihn beim Generieren nochmal ein.
  //    Betrifft v. a. mysqlEnum()- und varchar()-Defaults.
  content = content.replace(
    /\.default\('\\'((?:[^'\\]|\\.)*)\\''\)/g,
    (_match, value: string) => {
      fixedQuotedDefaults += 1;
      return `.default('${value}')`;
    },
  );

  // 4. sql-Import sicherstellen, falls sql`` verwendet wurde
  if (fixedTimestampDefaults > 0) {
    if (!/from\s+['"]drizzle-orm['"]/.test(content)) {
      content = `import { sql } from 'drizzle-orm';\n${content}`;
    } else {
      content = content.replace(
        /import\s*\{([^}]*)\}\s*from\s*['"]drizzle-orm['"]/,
        (match, imports: string) => {
          const names = imports
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          if (!names.includes('sql')) {
            names.push('sql');
            return `import { ${names.join(', ')} } from 'drizzle-orm'`;
          }
          return match;
        },
      );
    }
  }

  if (content === original) {
    console.log('Keine bekannten Probleme gefunden, Datei unverändert.');
    return;
  }

  await writeFile(targetPath, content, 'utf8');

  console.log(`${targetPath} bereinigt:`);
  console.log(`  - ${removedNullDefaults}x .default('NULL') entfernt`);
  console.log(
    `  - ${fixedTimestampDefaults}x .default('current_timestamp()') -> sql\`CURRENT_TIMESTAMP\` korrigiert`,
  );
  console.log(
    `  - ${fixedQuotedDefaults}x doppelt-escapete Default-Strings (z. B. Enum-Defaults) bereinigt`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
