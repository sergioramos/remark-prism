const classNames = require('classnames');
const { CssSelectorParser } = require('css-selector-parser');
const escapeHtml = require('escape-html');
const { readFileSync } = require('fs');
const h = require('hastscript');
const { JSDOM } = require('jsdom');
const map = require('unist-util-map');
const rangeParser = require('parse-numeric-range');
const toHTML = require('hast-util-to-html');
const u = require('unist-builder');
const { compileFunction, createContext, runInContext } = require('vm');

const DOM_HIGHLIGHT = `
  return Prism.highlightElement(code);
`;

const NODE_HIGHLIGHT = `
  return Prism.highlight(node.value, Prism.languages[node.lang], node.lang);
`;

const LOAD_LANGS = `
  (require, fullpath) => {
    const mod = require(fullpath);
    return typeof mod === 'function' ? mod() : mod;
  };
`;

const PLUGINS = [
  'autolinker',
  'command-line',
  'data-uri-highlight',
  'diff-highlight',
  'inline-color',
  'keep-markup',
  'line-numbers',
  'show-invisibles',
  'treeview',
];

const PLUGIN = (src) => {
  return `
    window.Prism = Prism;

    try {
      const self = window;
      ${src};
    } catch(err) {
      try {
        ${src};
      } catch(err) {
        console.error(err);
      };
    };
`;
};

const createHighlighter = ({ plugins = [] }) => {
  delete require.cache[require.resolve('prismjs')];
  const Prism = require('prismjs');

  const { window } = new JSDOM('');

  window.Prism = Prism;
  const parsingContext = createContext(window);

  const highlightElement = compileFunction(DOM_HIGHLIGHT, ['code', 'Prism'], {
    parsingContext,
  });

  const highlight = compileFunction(NODE_HIGHLIGHT, ['node', 'Prism'], {
    parsingContext,
  });

  // load languages into the Prism object
  runInContext(LOAD_LANGS, parsingContext)(
    require,
    require.resolve('prismjs/components/index'),
  );

  // load plugins into the Prism object
  plugins.forEach((pl) => {
    const plugin = PLUGINS.includes(pl)
      ? `prismjs/plugins/${pl}/prism-${pl}`
      : pl;

    const filename = require.resolve(plugin);
    const src = PLUGIN(readFileSync(filename, 'utf-8'), parsingContext);
    return runInContext(src, parsingContext, { filename });
  });

  return ({ lang, value, attrs }) => {
    if (!lang || !Prism.languages[lang.split(/-/)[0]]) {
      return escapeHtml(value);
    }

    try {
      const pre = window.document.createElement('pre');
      const code = window.document.createElement('code');

      for (const [key, value] of Object.entries(attrs)) {
        pre.setAttribute(key, value);
        code.setAttribute(key, value);
      }

      code.textContent = value;
      pre.appendChild(code);
      highlightElement(code, Prism);

      return code.innerHTML;
    } catch (err) {
      console.error(err);
      return highlight({ value, lang }, Prism);
    }
  };
};

const highlightLine = (line, { showSpotlight }) => {
  if (!showSpotlight) {
    return `${line}\n`;
  }

  return `<span class="remark-highlight-code-line">${line}\n</span>`;
};

const selectorToAttrs = (selector) => {
  try {
    const parser = new CssSelectorParser();
    const { rule } = parser.parse(selector);
    const { attrs = [] } = rule;

    return attrs.reduce((memo, { name, operator, value }) => {
      if (operator !== '=') {
        return memo;
      }

      const isClass = name === 'class';
      const newValue = isClass
        ? [memo[name] || ''].concat(value).join(' ')
        : value;

      return Object.assign(memo, {
        [name]: newValue,
      });
    }, {});
  } catch (err) {
    console.error(err);
    return {};
  }
};

const parseLang = (str) => {
  const match = (regexp) => {
    const m = (str || '').match(regexp);
    return Array.isArray(m) ? m : [];
  };

  const [lang] = match(/^[a-zA-Z\d-]*/g);
  const selectors = match(/\[(.*?)\]/g).join('');
  const range = match(/\{(.*?)\}$/g)
    .join(',')
    .replace(/^\{/, '')
    .replace(/\}$/, '');

  const attrs = selectors.length ? selectorToAttrs(selectors) : {};
  const className = classNames(lang ? `language-${lang}` : '', attrs.class);
  const { legend = '', ...restAttrs } = attrs;

  return {
    lang,
    range: range ? rangeParser(range) : [],
    legend,
    attrs: {
      ...restAttrs,
      class: className,
    },
  };
};

module.exports = (options = {}) => (tree) => {
  const highlight = createHighlighter(options);
  const { transformInlineCode = false } = options;

  return map(tree, (node) => {
    const { type } = node;

    if (!['code', 'inlineCode'].includes(type)) {
      return node;
    }

    if (type === 'inlineCode' && !transformInlineCode) {
      return node;
    }

    const { value } = node;
    const { lang, attrs, legend, range } = parseLang(node.lang);

    const raw = highlight({ lang, value, attrs })
      .split(/\n/)
      .reduce((memo, line, idx) => {
        return memo.concat(
          highlightLine(line, { showSpotlight: range.includes(idx + 1) }),
        );
      }, '');

    const code = h('code', { className: `language-${lang}` }, u('raw', raw));
    const pre = h(
      'div',
      { className: 'remark-highlight' },
      [
        h('pre', attrs, [code]),
        legend ? h('legend', {}, [legend]) : null,
      ].filter(Boolean),
    );

    return u(
      'html',
      toHTML(/^inline/.test(type) ? code : pre, {
        allowDangerousHtml: true,
      }),
    );
  });
};
