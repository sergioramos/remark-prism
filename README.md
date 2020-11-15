# remark-prism

Syntax highlighter for markdown code blocks using [Prism](https://prismjs.com/) - with support for certain [plugins](https://prismjs.com/plugins/). This allows syntax highlighting without running any client-side code - other than CSS.

<div align="center">
  <img width="898" src="media/cover.png" alt="remark-prism">
</div>

## installation

```bash
λ yarn add remark-prism
```

## usage

```js
const src = `
\`\`\`javascript
console.log('Hello World');
\`\`\`
`;

require('remark')()
  .use(require('remark-prism'))
  .use(require('remark-html'))
  .process(src, (err, { contents }) => console.log(contents));
```

```html
<div class="remark-highlight">
  <pre class="language-javascript">
    <code>
      <span class="token console class-name">console</span>
      <span class="token punctuation">.</span>
      <span class="token method function property-access">log</span>
      <span class="token punctuation">(</span>
      <span class="token string">'Hello World'</span>
      <span class="token punctuation">)</span>
      <span class="token punctuation">;</span>
    </code>
  </pre>
</div>
```

### `transformInlineCode`

Add relevant class names to inline code snippets. For example when you use single backtick code examples.

```js
remark()
  .use(require('remark-prism'), { transformInlineCode: true })
  .use(require('remark-html'))
  .process(src, console.log);
```

### plugins

It supports some [Prism](https://prismjs.com/) plugins:

```js
remark()
  .use(require('remark-prism'), {
    plugins: [
      'autolinker',
      'command-line',
      'data-uri-highlight',
      'diff-highlight',
      'inline-color',
      'keep-markup',
      'line-numbers',
      'line-highlight',
      'show-invisibles',
      'treeview',
    ],
  })
  .use(require('remark-html'))
  .process(src, console.log);
```

> _Don't forget to include the appropriate css in your stylesheets. Refer to the documentation of each plugin._

### attributes

```markdown
\`\`\`diff-javascript[class="line-numbers"][class="diff-highlight"]
```

```html
<pre class="language-diff-javascript diff-highlight line-numbers">...</pre>
```

## license

BSD-3-Clause
