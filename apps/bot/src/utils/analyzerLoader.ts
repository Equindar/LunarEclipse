import { readdirSync } from 'node:fs';
import path from 'node:path';
import type { MessageAnalyzer } from '../types/MessageAnalyzer.js';
import { dirnameFromMeta, importModule } from '../utils/esm.js';
import logger from './logger.js';

const __dirname = dirnameFromMeta(import.meta.url);
const addonLogger = logger.child({ module: 'Addons' });

export async function loadAnalyzers(): Promise<MessageAnalyzer[]> {
  addonLogger.info('Analyzers werden geladen...');
  const analyzers: MessageAnalyzer[] = [];

  try {
    const analyzersPath = path.join(__dirname, '..', 'addons', 'analyzers');
    const files = readdirSync(analyzersPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(analyzersPath, file);
      const module = await importModule<Record<string, MessageAnalyzer>>(filePath);

      for (const key in module) {
        const analyzer = module[key];
        if (!analyzer) {
          addonLogger.debug(`Übersprungen: Export "${key}" ist kein gültiger Analyzer.`);
          continue;
        }
        analyzers.push(analyzer);
        addonLogger.debug(`Analyzer geladen: ${analyzer.name}`);
      }
    }

    addonLogger.info('Analyzers erfolgreich geladen.');
  } catch (error) {
    addonLogger.error('Laden (Analyzers): fehlgeschlagen: ', error);
  }

  return analyzers;
}
