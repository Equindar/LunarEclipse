import dotenv from 'dotenv';
import { IConfigurationSchema } from './types/Configuration';
import path from 'path';
import fs from 'fs';


export default class Configuration {
  private config: Partial<IConfigurationSchema> = {};
  private persistFile?: string | null;
  private configFilePath?: string | null;

  /**
   * @param persistFile optional: wo persistente, nicht-sensitive Felder gespeichert werden sollen (z.B. servers)
   * @param configFilePath optional: Pfad zur config.json, die in load() eingelesen wird (default './config.json')
   */
  constructor(persistFile?: string | null, configFilePath?: string | null) {
    this.persistFile = persistFile ?? null;
    this.configFilePath = configFilePath ?? path.resolve(process.cwd(), 'config.json');
  }

  /**
   *
   */
  public init(): void {
    // dotenv laden
    dotenv.config();

    // Mappe environment variables
    const {
      DISCORD_CLIENT_ID,
      DISCORD_TOKEN,
      LOG_LEVEL,
      LOG_DIRECTORY,
      DATABASE_HOST,
      DATABASE_USER,
      DATABASE_PASSWORD,
      DATABASE_NAME,
    } = process.env;

    // Pflichtprüfung für Discord Credentials (sollte Bot-Start verhindern wenn nicht vorhanden)
    if (!DISCORD_CLIENT_ID || !DISCORD_TOKEN) {
      throw new Error('Missing required environment variables: DISCORD_CLIENT_ID and/or DISCORD_TOKEN.');
    }

    // Setze Basiskonfiguration basierend auf env (bei fehlenden Werten: leere Strings / null / leere Arrays)
    this.config.app = {
      id: DISCORD_CLIENT_ID ?? '',
      token: DISCORD_TOKEN ?? '',
    };

    this.config.servers = []; // default leer

    this.config.database = {
      host: DATABASE_HOST ?? '',
      user: DATABASE_USER ?? '',
      password: DATABASE_PASSWORD ?? '',
      database: DATABASE_NAME ?? '',
    };

    this.config.logging = {
      level: LOG_LEVEL ?? null,
      dir: LOG_DIRECTORY ?? null,
    };

    // Falls persistente Datei vorhanden und geladen bei Konstruktion, wollen wir sie nicht automatisch hier einlesen.
    // load() übernimmt das Überschreiben/Ersetzen.
  }

  /**
   * load(): Falls eine config.json existiert: lese sie ein und überschreibe
   * die zuvor durch init() gesetzten Werte dort, wo Werte in der Datei vorhanden sind.
   *
   * Falls die Datei nicht existiert -> kein Fehler (Verhalten: env-only).
   */
  public async load(): Promise<void> {
    const cfgPath = this.configFilePath ?? path.resolve(process.cwd(), 'config.json');
    try {
      const content = await fs.promises.readFile(cfgPath, { encoding: 'utf8' });
      const parsed = JSON.parse(content);

      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error(`Invalid JSON in config file: ${cfgPath}`);
      }

      // perform deep merge where values from parsed override existing values
      this.config = deepMergeOverwrite(this.config as Record<string, unknown>, parsed as Record<string, unknown>) as Partial<IConfigurationSchema>;
    } catch (err) {
      // Wenn Datei nicht gefunden, ignorieren — wir halten uns an: init() hat Pflicht geprüft.
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        // keine config.json -> okay, weiter mit env-only
        return;
      }
      // andere Fehler weiterwerfen
      throw err;
    }
  }

  /**
   * Dot-path Getter z.B. "database.host"
   */
  public get<T = unknown>(key: string, fallback?: T): T | undefined {
    const parts = key.split('.');
    let cur: any = this.config;
    for (const p of parts) {
      if (cur == null || typeof cur !== 'object') return fallback;
      cur = cur[p];
    }
    return (cur === undefined ? fallback : (cur as T));
  }

  /**
   * Dot-path Setter z.B. set("servers", [...]) oder set("database.host", "x")
   * persist: optional. Wenn persistFile beim Konstruktor gesetzt wurde, und persist=true,
   * wird eine persistente Datei aktualisiert (nur nicht-sensitive Keys).
   */
  public async set(key: string, value: any, persist = false): Promise<void> {
    const parts = key.split('.');
    let cur: any = this.config;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (i === parts.length - 1) {
        cur[p] = value;
      } else {
        if (!cur[p] || typeof cur[p] !== 'object') {
          cur[p] = {};
        }
        cur = cur[p];
      }
    }

    if (persist && this.persistFile) {
      await this.writePersistFile();
    }
  }

  /**
   * Liefert eine tiefe Kopie der aktuellen Config (readonly)
   */
  public all(): Readonly<Partial<IConfigurationSchema>> {
    return JSON.parse(JSON.stringify(this.config));
  }

  /**
   * Intern: schreibt persistente Datei; Achtung: speichere niemals secrets (z. B. database.password) unverschlüsselt.
   * Standard: persistiere nur `servers`. Falls du mehr persistieren willst, passe toPersist an.
   */
  private async writePersistFile(): Promise<void> {
    if (!this.persistFile) return;
    const dir = path.dirname(this.persistFile);
    await fs.promises.mkdir(dir, { recursive: true });

    const toPersist: Partial<IConfigurationSchema> = {
      servers: this.config.servers ?? [],
    };

    await fs.promises.writeFile(this.persistFile, JSON.stringify(toPersist, null, 2), { encoding: 'utf8' });
  }
}

/**
 * Hilfsfunktion: tiefe Merge-Implementierung, die property-Werte aus `overrides`
 * *überschreibt* die Werte in `base`. Arrays werden ersetzt (nicht gemerged).
 * - base: vorhandene (z.B. env-basierte) Konfiguration
 * - overrides: gelesene config.json
 */
function deepMergeOverwrite(base: Record<string, unknown>, overrides: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };

  for (const key of Object.keys(overrides)) {
    const v = overrides[key];
    const bv = base[key];

    if (v === null || v === undefined) {
      // wenn override explizit null/undefined setzt, setze es ebenfalls
      out[key] = v;
    } else if (Array.isArray(v)) {
      // arrays ersetzen
      out[key] = v.slice();
    } else if (isPlainObject(v) && isPlainObject(bv as Record<string, unknown>)) {
      // rekursiv mergen für Objekte
      out[key] = deepMergeOverwrite(bv as Record<string, unknown>, v as Record<string, unknown>);
    } else {
      // einfache Werte überschreiben
      out[key] = v;
    }
  }

  return out;
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}
