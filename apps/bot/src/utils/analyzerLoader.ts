// utils/analyzerLoader.ts
import path from 'node:path';
import { dirnameFromMeta } from './esm.js';
import { AddonLoadingError } from '../errors/AddonLoadingError.js';
import type { MessageAnalyzer } from '../types/MessageAnalyzer.js';
import { loadAddons } from '../handlers/addonHandler.js';

const __dirname = dirnameFromMeta(import.meta.url);

function isMessageAnalyzer(value: unknown): value is MessageAnalyzer {
  return (
    typeof (value as MessageAnalyzer).name === 'string' &&
    typeof (value as MessageAnalyzer).analyze === 'function'
  );
}

export function loadAnalyzers(
  onLoadError?: (error: AddonLoadingError) => void | Promise<void>,
): Promise<MessageAnalyzer[]> {
  return loadAddons<MessageAnalyzer>({
    addonType: 'Analyzer',
    directory: path.join(__dirname, '..', 'addons', 'analyzers'),
    isValid: isMessageAnalyzer,
    onLoadError,
  });
}
