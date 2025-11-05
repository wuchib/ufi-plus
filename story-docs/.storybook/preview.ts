// .storybook/preview.ts
import type { Preview } from "@storybook/vue3";

import "@ufi-plus/theme-chalk/index.css";
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
