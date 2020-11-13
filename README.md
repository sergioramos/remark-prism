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

### `showSpotlight`

Based [`gatsby-remark-prismjs`](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-prismjs), it supports natively the [`line-highlight`](https://prismjs.com/plugins/line-highlight/) since that plugin doesn't work well in SSR.

```js
remark()
  .use(require('remark-prism'), { showSpotlight: true })
  .use(require('remark-html'))
  .process(src, console.log);
```

```
\`\`\`html{1,3-4,8}
...
```

Required CSS:

```css
/* from: https://github.com/chasm/gatsby-remark-prismjs/blob/af90edfd6f378a7ffd8d70e50a540077795e5c2c/README.md#L83-L110 */
/* container of the code block */
.remark-highlight {
  border: 1px solid #dddddd;
  border-radius: 0.3em;
  margin: 0.5em 0;
  overflow: auto;
}

.remark-highlight pre[class*='language-'] {
  background-color: transparent;
  margin: 0;
  padding: 0;
  overflow: initial;
  float: left; /* 1 */
  min-width: 100%; /* 2 */
}

/* highlight for each spotlight line */
.remark-highlight-code-line {
  background-color: #feb;
  display: block;
  margin-right: -1em;
  margin-left: -1em;
  padding-right: 1em;
  padding-left: 0.75em;
  border-left: 0.25em solid #f99;
}

/* Gutter for line numbers when the line-numbers plugin is active */
.remark-highlight pre[class*='language-'].line-numbers {
  padding-left: 2.8em;
}
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
