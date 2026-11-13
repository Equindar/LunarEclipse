import { addons, type State } from "storybook/manager-api";
import { themes } from "storybook/theming";

addons.setConfig({
  theme: themes.dark,
layoutCustomisations: {
    showPanel(state: State, defaultValue: boolean) {
      const tags = state.index?.[state.storyId]?.tags ?? [];

      if (tags.includes('readonly')) {
        return false;
      }

      return defaultValue;
    },
  },
 });
