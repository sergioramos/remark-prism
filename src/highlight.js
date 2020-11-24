const escapeHtml = require('escape-html');
const { readFileSync } = require('fs');
const { JSDOM } = require('jsdom');
const parse5 = require('parse5');
const htmlparser2Adapter = require('parse5-htmlparser2-tree-adapter');
const { createContext, runInContext } = require('vm');

const components = require('prismjs/components.json');
const getLoader = require('prismjs/dependencies');

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

const domHighlight = (value, attrs = {}, range = []) => {
  const MULTILINE_TOKEN_SPAN = /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g;

  // eslint-disable-next-line no-undef
  const pre = window.document.createElement('pre');
  // eslint-disable-next-line no-undef
  const code = window.document.createElement('code');

  for (const [key, value] of Object.entries(attrs)) {
    pre.setAttribute(key, value);
    code.setAttribute(key, value);
  }

  code.textContent = value;
  pre.appendChild(code);

  // eslint-disable-next-line no-undef
  window.Prism.highlightElement(code);

  return code.innerHTML
    .replace(MULTILINE_TOKEN_SPAN, (match, token) => {
      return match.replace(/\n/g, `</span>\n<span class="token ${token}">`);
    })
    .split(/\n/)
    .reduce((memo, line, idx) => {
      return memo.concat(
        range.includes(idx + 1)
          ? `<span class="remark-highlight-code-line">${line}\n</span>`
          : `${line}\n`,
      );
    }, '');
};

const loadLanguages = (parsingContext) => {
  const loadedLanguages = new Set();

  const languages = Object.keys(components.languages).filter(
    (l) => l !== 'meta',
  );

  const loaded = [
    ...loadedLanguages,
    ...Object.keys(parsingContext.Prism.languages),
  ];

  getLoader(components, languages, loaded).load((lang) => {
    if (!(lang in components.languages)) {
      console.warn('Language does not exist: ' + lang);
      return;
    }

    const filename = require.resolve(`prismjs/components/prism-${lang}`);
    runInContext(RUN(readFileSync(filename, 'utf-8')), parsingContext, {
      filename,
    });

    loadedLanguages.add(lang);
  });

  return Object.entries(components.languages).reduce(
    (memo, [name, { alias }]) => {
      return memo.concat(name).concat(alias).filter(Boolean);
    },
    [],
  );
};

const RUN = (src) => {
  return `
    window.Prism = Prism;

    try {
      const self = window;
      ${src};
    } catch(err) {
      console.error(err);
    };
  `;
};

const deserialize = (html) => {
  const document = parse5.parse(html, {
    treeAdapter: htmlparser2Adapter,
  });

  const toHast = ({ type, name, attribs = {}, data: value, children = [] }) => {
    const { class: className = '', ...attrs } = attribs;

    const _children = children.map(toHast);
    const properties = {
      ...attrs,
      className: className.split(/\s/).filter(Boolean),
    };

    return {
      type: type === 'tag' ? 'element' : 'text',
      value,
      tagName: name,
      data: {
        hName: name,
        hProperties: properties,
        hChildren: _children,
      },
      properties,
      children: _children,
    };
  };

  return document.children
    .pop()
    .children.find(({ name }) => name === 'body')
    .children.map(toHast);
};

module.exports = ({ plugins = [] }) => {
  const { window } = new JSDOM('');
  const parsingContext = createContext(window);

  const prismjs = require.resolve('prismjs');
  runInContext(RUN(readFileSync(prismjs, 'utf-8')), parsingContext, {
    filename: prismjs,
  });

  // load languages into the Prism object
  const languages = loadLanguages(parsingContext);
  const highlightElement = runInContext(
    domHighlight.toString(),
    parsingContext,
  );

  // load plugins into the Prism object
  plugins.forEach((pl) => {
    const plugin = PLUGINS.includes(pl)
      ? `prismjs/plugins/${pl}/prism-${pl}`
      : pl;

    const filename = require.resolve(plugin);
    return runInContext(RUN(readFileSync(filename, 'utf-8')), parsingContext, {
      filename,
    });
  });

  return ({ lang, value, attrs, range = [] }) => {
    const fallback = () => {
      return [
        {
          type: 'text',
          value: escapeHtml(value),
        },
      ];
    };

    if (!lang) {
      fallback();
    }

    if (
      !languages.includes(lang.replace(/^diff-/, '')) &&
      lang !== 'treeview'
    ) {
      return fallback();
    }

    return deserialize(highlightElement(value, attrs, range));
  };
};

module.exports.PLUGINS = PLUGINS;
