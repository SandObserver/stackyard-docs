// @ts-check
export const SPECULATION_RULES = JSON.stringify({
  prerender: [
    {
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: ['/api/*', '/widgets/*', '/*.*'] } },
          { not: { selector_matches: '[target=_blank], [download]' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
});
