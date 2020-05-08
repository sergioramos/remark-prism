const { join } = require('path');
const puppeteer = require('puppeteer');
const { readFile, writeFile } = require('mz/fs');
const prettier = require('prettier');
const remark = require('remark');
const test = require('ava');

const { CI = 'false' } = process.env;
const FIXTURES = join(__dirname, 'fixtures');
const OUTPUTS = join(__dirname, 'outputs');

const compile = async (src, options) => {
  const config = await prettier.resolveConfig(__filename);

  const prettify = (str) => {
    return prettier.format(str, { ...config, parser: 'html' });
  };

  const handleResult = (resolve, reject) => {
    return (err, file) => {
      if (err) {
        return reject(err);
      }

      return resolve(
        prettify(`<link href="./theme.css" rel="stylesheet" />${String(file)}`),
      );
    };
  };

  return new Promise((resolve, reject) => {
    return remark()
      .use(require('..'), options)
      .use(require('remark-html'))
      .process(src, handleResult(resolve, reject));
  });
};

const takeScreenshot = async (html, path) => {
  if (JSON.parse(CI)) {
    return;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle2' });
  await page.screenshot({ path, fullPage: true });

  await browser.close();
};

test('languages', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'languages.md'));
  const output = await compile(markdown);

  await writeFile(join(OUTPUTS, 'languages.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'languages.png'));

  t.snapshot(output);
});

test('autolinker', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'autolinker.md'));
  const output = await compile(markdown, {
    plugins: ['prismjs/plugins/autolinker/prism-autolinker'],
  });

  await writeFile(join(OUTPUTS, 'autolinker.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'autolinker.png'));

  t.snapshot(output);
});

test('command-line', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'command-line.md'));
  const output = await compile(markdown, {
    plugins: ['prismjs/plugins/command-line/prism-command-line'],
  });

  await writeFile(join(OUTPUTS, 'command-line.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'command-line.png'));

  t.snapshot(output);
});

test('data-uri-highlight', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'data-uri-highlight.md'));
  const output = await compile(markdown, {
    plugins: ['prismjs/plugins/data-uri-highlight/prism-data-uri-highlight'],
  });

  await writeFile(join(OUTPUTS, 'data-uri-highlight.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'data-uri-highlight.png'));

  t.snapshot(output);
});

test('diff-highlight', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'diff-highlight.md'));
  const output = await compile(markdown, {
    plugins: ['prismjs/plugins/diff-highlight/prism-diff-highlight'],
  });

  await writeFile(join(OUTPUTS, 'diff-highlight.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'diff-highlight.png'));

  t.snapshot(output);
});

test('inline-color', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'inline-color.md'));
  const output = await compile(markdown, {
    plugins: ['prismjs/plugins/inline-color/prism-inline-color'],
  });

  await writeFile(join(OUTPUTS, 'inline-color.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'inline-color.png'));

  t.snapshot(output);
});

test('keep-markup', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'keep-markup.md'));
  const output = await compile(markdown, {
    plugins: ['prismjs/plugins/keep-markup/prism-keep-markup'],
  });

  await writeFile(join(OUTPUTS, 'keep-markup.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'keep-markup.png'));

  t.snapshot(output);
});

test('line-highlight', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'line-highlight.md'));
  const output = await compile(markdown);

  await writeFile(join(OUTPUTS, 'line-highlight.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'line-highlight.png'));

  t.snapshot(output);
});

test('line-numbers', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'line-numbers.md'));
  const output = await compile(markdown, {
    plugins: ['prismjs/plugins/line-numbers/prism-line-numbers'],
  });

  await writeFile(join(OUTPUTS, 'line-numbers.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'show-numbers.png'));

  t.snapshot(output);
});

test('show-invisibles', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'show-invisibles.md'));
  const output = await compile(markdown, {
    plugins: ['prismjs/plugins/show-invisibles/prism-show-invisibles'],
  });

  await writeFile(join(OUTPUTS, 'show-invisibles.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'show-invisibles.png'));

  t.snapshot(output);
});

test('treeview', async (t) => {
  const markdown = await readFile(join(FIXTURES, 'treeview.md'));
  const output = await compile(markdown, {
    plugins: ['prismjs/plugins/treeview/prism-treeview'],
  });

  await writeFile(join(OUTPUTS, 'treeview.html'), output);
  await takeScreenshot(output, join(OUTPUTS, 'treeview.png'));

  t.snapshot(output);
});
