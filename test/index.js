const test = require('ava');
const { writeFile } = require('mz/fs');
const { join } = require('path');
const puppeteer = require('puppeteer');
const prettier = require('prettier');
const format = require('rehype-format');
const html = require('rehype-stringify');
const markdown = require('remark-parse');
const vfile = require('to-vfile');
const unified = require('unified');

const prism = require('..');

const { CI = 'false' } = process.env;
const FIXTURES = join(__dirname, 'fixtures');
const OUTPUTS = join(__dirname, 'outputs');

const compile = async (testcase, options) => {
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

test('languages', async (t) => {
  const html = await compile('languages');

  const file = join(OUTPUTS, 'languages.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'languages.png'));

  t.snapshot(html);
});

test('autolinker', async (t) => {
  const html = await compile('autolinker', {
    plugins: ['autolinker'],
  });

  const file = join(OUTPUTS, 'autolinker.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'autolinker.png'));

  t.snapshot(html);
});

test('command-line', async (t) => {
  const html = await compile('command-line', {
    plugins: ['command-line'],
  });

  const file = join(OUTPUTS, 'command-line.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'command-line.png'));

  t.snapshot(html);
});

test('data-uri-highlight', async (t) => {
  const html = await compile('data-uri-highlight', {
    plugins: ['data-uri-highlight'],
  });

  const file = join(OUTPUTS, 'data-uri-highlight.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'data-uri-highlight.png'));

  t.snapshot(html);
});

test('diff-highlight', async (t) => {
  const html = await compile('diff-highlight', {
    plugins: ['diff-highlight'],
  });

  const file = join(OUTPUTS, 'diff-highlight.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'diff-highlight.png'));

  t.snapshot(html);
});

test('inline-color', async (t) => {
  const html = await compile('inline-color', {
    plugins: ['inline-color'],
  });

  const file = join(OUTPUTS, 'inline-color.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'inline-color.png'));

  t.snapshot(html);
});

test('keep-markup', async (t) => {
  const html = await compile('keep-markup', {
    plugins: ['keep-markup'],
  });

  const file = join(OUTPUTS, 'keep-markup.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'keep-markup.png'));

  t.snapshot(html);
});

test('legend', async (t) => {
  const html = await compile('legend');

  const file = join(OUTPUTS, 'legend.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'legend.png'));

  t.snapshot(html);
});

test('line-highlight', async (t) => {
  const html = await compile('line-highlight', {
    plugins: ['line-highlight'],
  });

  const file = join(OUTPUTS, 'line-highlight.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'line-highlight.png'));

  t.snapshot(html);
});

test('line-numbers', async (t) => {
  const html = await compile('line-numbers', {
    plugins: ['line-numbers'],
  });

  const file = join(OUTPUTS, 'line-numbers.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'show-numbers.png'));

  t.snapshot(html);
});

test('no-lang', async (t) => {
  const html = await compile('no-lang');

  const file = join(OUTPUTS, 'no-lang.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'no-lang.png'));

  t.snapshot(html);
});

test('show-invisibles', async (t) => {
  const html = await compile('show-invisibles', {
    plugins: ['show-invisibles'],
  });

  const file = join(OUTPUTS, 'show-invisibles.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'show-invisibles.png'));

  t.snapshot(html);
});

test('treeview', async (t) => {
  const html = await compile('treeview', {
    plugins: ['treeview'],
  });

  const file = join(OUTPUTS, 'treeview.html');
  await writeFile(file, html);
  await takeScreenshot(file, join(OUTPUTS, 'treeview.png'));

  t.snapshot(html);
});