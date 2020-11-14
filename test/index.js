const test = require('ava');
const { transform } = require('@babel/core');
const { readFile, writeFile } = require('mz/fs');
const mdx = require('@mdx-js/mdx');
const { join } = require('path');
const puppeteer = require('puppeteer');
const prettier = require('prettier');
const format = require('rehype-format');
const html = require('rehype-stringify');
const markdown = require('remark-parse');
const Parallel = require('apr-parallel');
const rollup = require('rollup');
const React = require('react');
const ReactDOM = require('react-dom/server');
const virtual = require('@rollup/plugin-virtual');
const vfile = require('to-vfile');
const unified = require('unified');

const prism = require('..');

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

const compileHtml = async (testcase, options) => {
  const config = await prettier.resolveConfig(__filename);

  const prettify = (str) => {
    return prettier.format(str, { ...config, parser: 'html' });
  };

  return new Promise((resolve, reject) => {
    const file = vfile.readSync(join(FIXTURES, `${testcase}.md`));

    return unified()
      .use(markdown)
      .use(prism, options)
      .use(format)
      .use(html)
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
  const { html, jsx } = await Parallel({
    html: async () => {
      const output = await compileHtml(name, options);
      await writeFile(join(OUTPUTS, `${name}.html`), output);

      return output;
    },
    jsx: async () => {
      const src = await readFile(join(FIXTURES, `${name}.md`));
      const output = await compileJsx(src, options);
      await writeFile(join(OUTPUTS, `${name}.jsx.html`), output);

      return output;
    },
  });

  return [html, jsx];
};

test('languages', async (t) => {
  const [html, jsx] = await compileAll('languages');

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'languages.html'),
    join(OUTPUTS, 'languages.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'languages.jsx.html'),
    join(OUTPUTS, 'languages.jsx.png'),
  );
});

test('autolinker', async (t) => {
  const [html, jsx] = await compileAll('autolinker', {
    plugins: ['autolinker'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'autolinker.html'),
    join(OUTPUTS, 'autolinker.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'autolinker.jsx.html'),
    join(OUTPUTS, 'autolinker.jsx.png'),
  );
});

test('command-line', async (t) => {
  const [html, jsx] = await compileAll('command-line', {
    plugins: ['command-line'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'command-line.html'),
    join(OUTPUTS, 'command-line.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'command-line.jsx.html'),
    join(OUTPUTS, 'command-line.jsx.png'),
  );
});

test('data-uri-highlight', async (t) => {
  const [html, jsx] = await compileAll('data-uri-highlight', {
    plugins: ['data-uri-highlight'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'data-uri-highlight.html'),
    join(OUTPUTS, 'data-uri-highlight.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'data-uri-highlight.jsx.html'),
    join(OUTPUTS, 'data-uri-highlight.jsx.png'),
  );
});

test('diff-highlight', async (t) => {
  const [html, jsx] = await compileAll('diff-highlight', {
    plugins: ['diff-highlight'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'diff-highlight.html'),
    join(OUTPUTS, 'diff-highlight.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'diff-highlight.jsx.html'),
    join(OUTPUTS, 'diff-highlight.jsx.png'),
  );
});

test('inline-color', async (t) => {
  const [html, jsx] = await compileAll('inline-color', {
    plugins: ['inline-color'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'inline-color.html'),
    join(OUTPUTS, 'inline-color.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'inline-color.jsx.html'),
    join(OUTPUTS, 'inline-color.jsx.png'),
  );
});

test('keep-markup', async (t) => {
  const [html, jsx] = await compileAll('keep-markup', {
    plugins: ['keep-markup'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'keep-markup.html'),
    join(OUTPUTS, 'keep-markup.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'keep-markup.jsx.html'),
    join(OUTPUTS, 'keep-markup.jsx.png'),
  );
});

test('legend', async (t) => {
  const [html, jsx] = await compileAll('legend');

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'legend.html'),
    join(OUTPUTS, 'legend.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'legend.jsx.html'),
    join(OUTPUTS, 'legend.jsx.png'),
  );
});

test('line-highlight', async (t) => {
  const [html, jsx] = await compileAll('line-highlight', {
    plugins: ['line-highlight'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'line-highlight.html'),
    join(OUTPUTS, 'line-highlight.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'line-highlight.jsx.html'),
    join(OUTPUTS, 'line-highlight.jsx.png'),
  );
});

test('line-numbers', async (t) => {
  const [html, jsx] = await compileAll('line-numbers', {
    plugins: ['line-numbers'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'line-numbers.html'),
    join(OUTPUTS, 'line-numbers.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'line-numbers.jsx.html'),
    join(OUTPUTS, 'line-numbers.jsx.png'),
  );
});

test('no-lang', async (t) => {
  const [html, jsx] = await compileAll('no-lang');

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'no-lang.html'),
    join(OUTPUTS, 'no-lang.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'no-lang.jsx.html'),
    join(OUTPUTS, 'no-lang.jsx.png'),
  );
});

test('show-invisibles', async (t) => {
  const [html, jsx] = await compileAll('show-invisibles', {
    plugins: ['show-invisibles'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'show-invisibles.html'),
    join(OUTPUTS, 'show-invisibles.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'show-invisibles.jsx.html'),
    join(OUTPUTS, 'show-invisibles.jsx.png'),
  );
});

test('treeview', async (t) => {
  const [html, jsx] = await compileAll('treeview', {
    plugins: ['treeview'],
  });

  t.snapshot(html);
  t.snapshot(jsx);

  await takeScreenshot(
    join(OUTPUTS, 'treeview.html'),
    join(OUTPUTS, 'treeview.png'),
  );

  await takeScreenshot(
    join(OUTPUTS, 'treeview.jsx.html'),
    join(OUTPUTS, 'treeview.jsx.png'),
  );
});
