// @ts-check

const GROUP_ICONS = {
  'Getting in': 'eye',
  'The dashboard': 'dashboard',
  'Apps and badges': 'app',
  Widgets: 'widget',
  'Settings that do not apply': 'general',
  'Not actually broken': 'check',
};

/** @returns {any} */
const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const text = value => ({ type: 'text', value });
const elements = node => node.children.filter(c => c.type === 'element');
const plain = node => (node.type === 'text' ? node.value : (node.children ?? []).map(plain).join(''));

function heading(node, level) {
  if (node.type !== 'element') return undefined;
  if (node.tagName === `h${level}`) return node;
  if (node.properties?.className?.includes(`level-h${level}`)) return elements(node).find(c => c.tagName === `h${level}`);
  return undefined;
}

const filterControl = placeholder =>
  el('div', { className: ['sy-filter'], dataSyFilter: '', hidden: true }, [
    el('input', { type: 'search', placeholder, ariaLabel: placeholder, autoComplete: 'off' }),
    el('p', { className: ['sr-only'], role: 'status', dataSyFilterStatus: '' }),
  ]);
const filterEmpty = () => el('p', { className: ['sy-filter__none'], dataSyFilterNone: '', hidden: true }, [text('Nothing matches that text.')]);

function buildProblems(tree) {
  const out = [];
  let box;
  let body;
  for (const node of tree.children) {
    const h2 = heading(node, 2);
    const h3 = heading(node, 3);
    if (h2) {
      if (!out.some(n => n.properties?.dataSyFilter !== undefined)) out.push(filterControl('Describe what you see'));
      const icon = GROUP_ICONS[plain(h2)];
      if (icon) {
        h2.children.unshift(
          el('svg', { className: ['sy-group-icon'], width: 22, height: 22, ariaHidden: 'true', focusable: 'false' }, [
            el('use', { href: `#sy-solid-${icon}` }),
          ]),
        );
      }
      box = el('div', { className: ['sy-list__box', 'sy-list__box--filtered'] });
      body = undefined;
      out.push(el('section', { className: ['sy-list', 'sy-problem-group'], dataSyFilterGroup: '' }, [node, box]));
    } else if (h3 && box) {
      h3.properties.className = ['sy-disc__name'];
      body = el('div', { className: ['sy-disc__body', 'sy-disc__body--prose'] });
      box.children.push(
        el('details', { className: ['sy-disc'], dataSyFilterItem: '' }, [
          el('summary', { className: ['sy-disc__row'] }, [
            el('span', { className: ['sy-disc__main'] }, [h3]),
            el('span', { className: ['sy-disc__chev'], ariaHidden: 'true' }),
          ]),
          body,
        ]),
      );
    } else if (body) {
      if (node.type !== 'text' || node.value.trim()) body.children.push(node);
    } else {
      out.push(node);
    }
  }
  out.push(filterEmpty());
  tree.children = out;
}

function buildMessages(tree) {
  const index = tree.children.findIndex(n => n.type === 'element' && (n.tagName === 'table' || elements(n).some(c => c.tagName === 'table')));
  if (index < 0) return;
  const holder = tree.children[index];
  const table = holder.tagName === 'table' ? holder : elements(holder).find(c => c.tagName === 'table');
  table.properties.className = ['sy-msg-table'];
  for (const section of elements(table)) {
    for (const row of elements(section)) {
      const [message, area, meaning] = elements(row);
      if (section.tagName === 'tbody') {
        message.children.push(el('div', { className: ['sy-msg-area'] }, area.children));
        row.properties.dataSyFilterItem = '';
      }
      row.children = [message, meaning];
    }
  }
  tree.children.splice(index, 1, filterControl('Type part of the message'), holder, filterEmpty());
}

export default function rehypeProblemPages() {
  return (tree, file) => {
    const path = file.path ?? file.history?.[0] ?? '';
    if (path.endsWith('/docs/troubleshooting.md')) buildProblems(tree);
    if (path.endsWith('/docs/troubleshooting/messages.md')) buildMessages(tree);
  };
}
