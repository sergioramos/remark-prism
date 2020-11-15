const classNames = require('classnames');
const { CssSelectorParser } = require('css-selector-parser');
const map = require('unist-util-map');
const rangeParser = require('parse-numeric-range');
const createHighlighter = require('./highlight');

const h = (type, attrs = {}, children = []) => {
  return {
    type: 'element',
    tagName: type,
    data: {
      hName: type,
      hProperties: attrs,
    },
    properties: attrs,
    children,
  };
};

const selectorToAttrs = (selector) => {
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
};

const parseLang = (str) => {
  const match = (regexp) => {
    const m = (str || '').match(regexp);
    return Array.isArray(m) ? m.filter(Boolean) : [];
  };

  const [lang = 'unknown'] = match(/^[a-zA-Z\d-]*/g);
  const selectors = match(/\[(.*?)\]/g).join('');

  const attrs = selectors.length ? selectorToAttrs(selectors) : {};
  const className = classNames(`language-${lang}`, attrs.class);
  const { legend = '', ...restAttrs } = attrs;

  const range = rangeParser(
    match(/\{(.*?)\}$/g)
      .join(',')
      .replace(/^\{/, '')
      .replace(/\}$/, ''),
  );

  return {
    lang,
    legend,
    range,
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
    const { lang = 'unknown', attrs, legend, range } = parseLang(node.lang);
    const { class: className = '', ...restAttrs } = attrs;

    const code = h(
      'code',
      { className: `language-${lang}` },
      highlight({
        lang,
        value,
        attrs,
        range,
      }),
    );

    const pre = h(
      'div',
      { className: `remark-highlight` },
      [
        h(
          'pre',
          {
            ...restAttrs,
            className: className.split(/\s/),
          },
          [code],
        ),
        legend ? h('legend', {}, [{ type: 'text', value: legend }]) : null,
      ].filter(Boolean),
    );

    return /^inline/.test(type) ? code : pre;
  });
};
