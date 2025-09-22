import { readdirSync } from 'fs';
import path from 'path';
import { MessageAnalyzer } from '../types/MessageAnalyzer';
import { logger } from './logger';

export function loadAnalyzers(): MessageAnalyzer[] {
  logger.info('Analyzers werden geladen...');
  const analyzers: MessageAnalyzer[] = [];

  try {
    const analyzersPath = path.join(__dirname, '..', 'addons', 'analyzers');
    const files = readdirSync(analyzersPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(analyzersPath, file);
      // dynamischer Import
      const module = require(filePath);
      for (const key in module) {
        analyzers.push(module[key] as MessageAnalyzer);
        logger.debug(`Analyzer geladen: ${module[key].name}`);
      }
    }
    logger.info('Analyzers erfolgreich geladen.');
  } catch (error) {
    logger.error('Laden (Analyzers): fehlgeschlagen: ', error);
  }

  return analyzers;
}
