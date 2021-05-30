const test = require('ava');
const { transform } = require('@babel/core');
const { readFile, writeFile, readdirSync } = require('mz/fs');
const mdx = require('@mdx-js/mdx');
const { join } = require('path');
const puppeteer = require('puppeteer');
const prettier = require('prettier');
const { default: ForEach } = require('apr-for-each');
const Parallel = require('apr-parallel');
const rollup = require('rollup');
const React = require('react');
const ReactDOM = require('react-dom/server');
const virtual = require('@rollup/plugin-virtual');
const vfile = require('to-vfile');
const unified = require('unified');

const prism = require('..');
const createHighlighter = require('../src/highlight');
const { PLUGINS } = require('../src/highlight');

const { CI = 'false' } = process.env;
const FIXTURES = join(__dirname, 'fixtures');
const OUTPUTS = join(__dirname, 'outputs');

const takeScreenshot = async (file, path) => {
  if (JSON.parse(CI)) {
    return;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${file}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await page.screenshot({ path, fullPage: true });
  await browser.close();
};

const compileJsx = async (src, options) => {
  const config = await prettier.resolveConfig(__filename);

  const prettify = (str) => {
    return prettier.format(str, { ...config, parser: 'html' });
  };

  const jsx = await mdx(src, {
    commonmark: true,
    gfm: true,
    remarkPlugins: [[prism, options]],
  });

  const { code } = transform(jsx.replace(/^\/\*\s*?@jsx\s*?mdx\s\*\//, ''), {
    sourceType: 'module',
    presets: [require.resolve('@babel/preset-react')],
  });

  const bundle = await rollup.rollup({
    input: 'main.js',
    treeshake: true,
    plugins: [
      virtual({
        'main.js': "import React from 'react';\n"
          .concat(`const mdx = React.createElement;\n`)
          .concat(code),
      }),
      require('rollup-plugin-babel')({
        sourceType: 'module',
        presets: [require.resolve('@babel/preset-react')],
      }),
    ],
  });

  const result = await bundle.generate({
    format: 'iife',
    name: 'Main',
    exports: 'named',
    globals: {
      react: 'React',
    },
  });

  // eslint-disable-next-line no-new-func
  const fn = new Function('React', `${result.output[0].code};\nreturn Main;`);
  const element = React.createElement(fn(React).default);

  return prettify(
    '<link href="./theme.css" rel="stylesheet" />'.concat(
      ReactDOM.renderToStaticMarkup(element),
    ),
  );
};

const compileMdAst = async (testcase, options) => {
  const config = await prettier.resolveConfig(__filename);

  const prettify = (str) => {
    return prettier.format(str, { ...config, parser: 'html' });
  };

  return new Promise((resolve, reject) => {
    const file = vfile.readSync(join(FIXTURES, `${testcase}.md`));

    return unified()
      .use(require('remark-parse'))
      .use(require('remark-stringify'))
      .use(prism, options)
      .use(require('remark-html'))
      .process(file, (err, file) => {
        if (err) {
          return reject(err);
        }

        return resolve(
          prettify(
            '<link href="./theme.css" rel="stylesheet" />'.concat(String(file)),
          ),
        );
      });
  });
};

const compileHAst = async (testcase, options) => {
  const config = await prettier.resolveConfig(__filename);

  const prettify = (str) => {
    return prettier.format(str, { ...config, parser: 'html' });
  };

  return new Promise((resolve, reject) => {
    const file = vfile.readSync(join(FIXTURES, `${testcase}.md`));

    return unified()
      .use(require('remark-parse'))
      .use(prism, options)
      .use(require('remark-rehype'))
      .use(require('rehype-format'))
      .use(require('rehype-stringify'))
      .process(file, (err, file) => {
        if (err) {
          return reject(err);
        }

        return resolve(
          prettify(
            '<link href="./theme.css" rel="stylesheet" />'.concat(String(file)),
          ),
        );
      });
  });
};

const compileAll = async (name, options = {}) => {
  const rawHighlighter = createHighlighter(options);

  let counter = 0;
  const highlighter = (...args) => {
    counter++;
    return rawHighlighter(...args);
  };

  const { mdast, hast, jsx, mdastWithExisting, hastWithExisting, jsxWithExisting } = await Parallel({
    mdast: async () => {
      const output = await compileMdAst(name, options);
      await writeFile(join(OUTPUTS, `${name}.mdast.html`), output);

      return output;
    },
    hast: async () => {
      const output = await compileHAst(name, options);
      await writeFile(join(OUTPUTS, `${name}.hast.html`), output);

      return output;
    },
    jsx: async () => {
      const src = await readFile(join(FIXTURES, `${name}.md`));
      const output = await compileJsx(src, options);
      await writeFile(join(OUTPUTS, `${name}.jsx.html`), output);

      return output;
    },
    mdastWithExisting: async () => {
      const output = await compileMdAst(name, {...options, highlighter});
      await writeFile(join(OUTPUTS, `${name}.mdastWithExisting.html`), output);

      return output;
    },
    hastWithExisting: async () => {
      const output = await compileHAst(name, {...options, highlighter});
      await writeFile(join(OUTPUTS, `${name}.hastWithExisting.html`), output);

      return output;
    },
    jsxWithExisting: async () => {
      const src = await readFile(join(FIXTURES, `${name}.md`));
      const output = await compileJsx(src, {...options, highlighter});
      await writeFile(join(OUTPUTS, `${name}.jsxWithExisting.html`), output);

      return output;
    },
  });

  if (counter < 2) {
    throw new Error(`Existing highlighter only used ${counter} time(s)`);
  }

  return [mdast, hast, jsx, mdastWithExisting, hastWithExisting, jsxWithExisting];
};

const fixtures = readdirSync(FIXTURES)
  .filter((filename) => /\.md$/.test(filename))
  .map((filename) => filename.replace(/\.md$/, ''));

for (const name of fixtures) {
  test(name, async (t) => {
    const [mdast, hast, jsx, mdastWithExisting, hastWithExisting, jsxWithExisting] = await compileAll(name, {
      plugins: [
        ...(PLUGINS.includes(name)
          ? [name]
          : name === 'all'
          ? [
              'autolinker',
              'command-line',
              'data-uri-highlight',
              'diff-highlight',
              'inline-color',
              'line-numbers',
              'treeview',
            ]
          : []),
      ].filter(Boolean),
    });

    t.snapshot(mdast);
    t.snapshot(hast);
    t.snapshot(jsx);
    t.snapshot(mdastWithExisting);
    t.snapshot(hastWithExisting);
    t.snapshot(jsxWithExisting);

    await ForEach(['jsx', 'mdast', 'hast', 'jsxWithExisting', 'hastWithExisting', 'jsxWithExisting'], async (type) => {
      return takeScreenshot(
        join(OUTPUTS, `${name}.${type}.html`),
        join(OUTPUTS, `${name}.${type}.png`),
      );
    });
  });
}
