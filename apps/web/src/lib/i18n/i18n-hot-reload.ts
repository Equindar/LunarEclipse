import { PluginOption } from 'vite';

export default function I18nHotReload(): PluginOption {
  return {
    name: 'i18n-hot-reload',
    handleHotUpdate({ file, server }) {
      if (file.includes('i18n') && file.endsWith('.json')) {
        console.log('Locale file updated');
        server.ws.send({
          type: 'custom',
          event: 'locales-update',
        });
      }
    },
  };
}
