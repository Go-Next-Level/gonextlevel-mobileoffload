// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mobileoffload.com',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap({
    filter: (page) => ![
      'https://mobileoffload.com/thank-you/',
      'https://mobileoffload.com/og-image/',
      'https://mobileoffload.com/franchise/',
      'https://mobileoffload.com/gyms/',
    ].includes(page),
  })]
});
