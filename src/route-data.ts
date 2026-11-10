import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

type Item = { children: Item[] };
const count = (items: Item[]): number => items.reduce((n, item) => n + 1 + count(item.children), 0);

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  if (route.toc && count(route.toc.items) - 1 < 2) route.toc.items = [];
});
