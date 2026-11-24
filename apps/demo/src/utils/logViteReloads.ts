import { relative } from 'node:path';
import { Plugin } from 'vite';

export function logViteReloads(): Plugin {
  let root = process.cwd()

  return {
    name: 'log-reloads',
    apply: 'serve',
    enforce: 'pre', // vor dem Dev-Server-Plugin, das den Reload auslöst
    configResolved(config) {
      root = config.root
    },
    handleHotUpdate({ file, modules }) {
      const time = new Date().toLocaleTimeString('de-DE')
      const changed = relative(root, file)
      const affected = modules.length
        ? modules.map(m => m.url).join(', ')
        : 'nur Server-Code (nicht im Client-Graph)'
      console.log(`[${time}] Reload ausgelöst von: ${changed}\n          betroffen: ${affected}`)
      // nichts zurückgeben: Verhalten bleibt unverändert
    },
  }
}
