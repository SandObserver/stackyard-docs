// @ts-check
import { defineConfig } from 'astro/config';

import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeTableScroll from './src/lib/rehype-table-scroll.mjs';
import mdx from '@astrojs/mdx';

const SITE = 'https://stackyard.sandobserver.com';

export default defineConfig({
  site: SITE,
  redirects: {
    '/docs/development': '/docs/contributing/',
    '/docs/adding-services': '/docs/apps-and-folders/',
    '/docs/advanced-configuration': '/docs/installation/docker/',
  },
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      rehypeTableScroll,
    ],
  },
  integrations: [
    starlight({
      title: 'Stackyard',
      description:
        'A calm, customizable dashboard for your services, designed to be useful without becoming another wall of data.',
      logo: {
        light: './public/img/stackyard-wordmark-light-b3140d1e.svg',
        dark: './public/img/stackyard-wordmark-dark-4680834d.svg',
        alt: '',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      components: {
        Head: './src/components/Head.astro',
        Sidebar: './src/components/Sidebar.astro',
      },
      customCss: ['./src/styles/docs.css'],
      head: [
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.webmanifest' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#0d1117' } },
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE}/img/og-48fdebbd.jpg` } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'Stackyard' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE}/img/og-48fdebbd.jpg` } },
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
        {
          label: 'Get started',
          items: [
            { label: 'Introduction', link: '/docs/' },
            { label: 'Comparison', link: '/docs/is-stackyard-for-you/' },
            { label: 'Install with Docker', link: '/docs/installation/docker/' },
            { label: 'Install on Unraid', link: '/docs/installation/unraid/' },
            { label: 'Build from source', link: '/docs/installation/build-from-source/' },
            { label: 'First setup', link: '/docs/first-setup/' },
          ],
        },
        {
          label: 'Build your dashboard',
          items: [
            { label: 'Add apps and folders', link: '/docs/apps-and-folders/' },
            { label: 'Show status badges', link: '/docs/badges/' },
            { label: 'Wallpaper and themes', link: '/docs/customization/' },
          ],
        },
        {
          label: 'Widgets',
          collapsed: true,
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
        {
          label: 'Run Stackyard',
          items: [
            { label: 'Back up and restore', link: '/docs/import-export/backup-and-restore/' },
            { label: 'Import', link: '/docs/import-export/migrating/' },
            { label: 'Use a reverse proxy', link: '/docs/reverse-proxy/' },
            { label: 'Security', link: '/docs/security/' },
          ],
        },
        { label: 'Settings', link: '/docs/settings-reference/' },
        { label: 'Troubleshooting', link: '/docs/troubleshooting/' },
        {
          label: 'Create a widget',
          collapsed: true,
          items: [
            { label: 'Build your first widget', link: '/docs/create-a-widget/' },
            { label: 'Manifest', link: '/docs/create-a-widget/manifest/' },
            { label: 'Data', link: '/docs/create-a-widget/data/' },
            { label: 'Widget page', link: '/docs/create-a-widget/widget-page/' },
            { label: 'Checklist', link: '/docs/create-a-widget/checklist/' },
          ],
        },
        {
          label: 'Contributing',
          collapsed: true,
          items: [
            { label: 'How to contribute', link: '/docs/contributing/' },
            { label: 'Architecture', link: '/docs/contributing/architecture/' },
            { label: 'Design system', link: '/docs/contributing/design-system/' },
            { label: 'Translations', link: '/docs/contributing/translations/' },
            { label: 'API errors', link: '/docs/contributing/api-errors/' },
            { label: 'Releasing', link: '/docs/contributing/releasing/' },
          ],
        },
        {
          label: 'About',
          collapsed: true,
          items: [
            { label: 'Accessibility', link: '/docs/accessibility/' },
            { label: 'Security policy', link: '/docs/security-policy/' },
            { label: 'Governance', link: '/docs/governance/' },
            { label: 'Support', link: '/docs/support/' },
            { label: 'Changelog', link: '/docs/changelog/' },
          ],
        },
      ],
    }),
    mdx(),
  ],
});
