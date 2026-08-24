// @ts-check
import { defineConfig } from 'astro/config';

import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import mdx from '@astrojs/mdx';

const SITE = 'https://stackyard.sandobserver.com';

export default defineConfig({
  site: SITE,
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
  integrations: [
    starlight({
      title: 'Stackyard',
      description:
        'A calm, customizable dashboard for your services, designed to be useful without becoming another wall of data.',
      logo: {
        light: './public/img/stackyard-wordmark-light.svg',
        dark: './public/img/stackyard-wordmark-dark.svg',
        alt: 'Stackyard',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/fonts.css', './src/styles/docs.css'],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            href: '/fonts/inter-latin.woff2',
            crossorigin: true,
          },
        },
        { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.webmanifest' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#0d1117' } },
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE}/img/og.jpg` } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'Stackyard' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE}/img/og.jpg` } },
      ],

      expressiveCode: {
        themes: ['github-dark', 'github-light'],
        styleOverrides: {
          borderRadius: '14px',
          borderWidth: '1px',
          codePaddingBlock: '0.9rem',
          frames: {
            editorActiveTabBackground: 'transparent',
            frameBoxShadowCssValue: 'none',
          },
        },
        defaultProps: { frame: 'none' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/SandObserver/stackyard' },
      ],
      editLink: {
        baseUrl: 'https://github.com/SandObserver/stackyard-docs/edit/main/',
      },
      sidebar: [
        { label: 'Introduction', link: '/docs/' },
        {
          label: 'Installation',
          items: [
            { label: 'Docker', link: '/docs/installation/docker/' },
            { label: 'Unraid', link: '/docs/installation/unraid/' },
            { label: 'Build from source', link: '/docs/installation/build-from-source/' },
          ],
        },
        { label: 'First setup', link: '/docs/first-setup/' },
        { label: 'Settings reference', link: '/docs/settings-reference/' },
        { label: 'Advanced configuration', link: '/docs/advanced-configuration/' },
        { label: 'Adding services', link: '/docs/adding-services/' },
        { label: 'Badges', link: '/docs/badges/' },
        {
          label: 'Widgets',
          items: [
            { label: 'Overview', link: '/docs/widgets/' },
            { label: 'Backup', link: '/docs/widgets/backup/' },
            { label: 'Books', link: '/docs/widgets/books/' },
            { label: 'Clock', link: '/docs/widgets/clock/' },
            { label: 'Connections', link: '/docs/widgets/connections/' },
            { label: 'Custom', link: '/docs/widgets/custom/' },
            { label: 'Dashboard switch', link: '/docs/widgets/dashboard-switch/' },
            { label: 'Disk health', link: '/docs/widgets/disk-health/' },
            { label: 'DNS', link: '/docs/widgets/dns/' },
            { label: 'GitHub', link: '/docs/widgets/github/' },
            { label: 'Now Playing', link: '/docs/widgets/now-playing/' },
            { label: 'System summary', link: '/docs/widgets/system-summary/' },
            { label: 'Weather', link: '/docs/widgets/weather/' },
          ],
        },
        { label: 'Customization', link: '/docs/customization/' },
        {
          label: 'Import and export',
          items: [
            { label: 'Backup and restore', link: '/docs/import-export/backup-and-restore/' },
            {
              label: 'Migrating from another dashboard',
              link: '/docs/import-export/migrating/',
            },
          ],
        },
        { label: 'Security', link: '/docs/security/' },
        { label: 'Accessibility', link: '/docs/accessibility/' },
        { label: 'Troubleshooting', link: '/docs/troubleshooting/' },
        { label: 'Support', link: '/docs/support/' },
        { label: 'Development', link: '/docs/development/' },
        { label: 'Changelog', link: '/docs/changelog/' },
      ],
    }),
    mdx(),
  ],
});
