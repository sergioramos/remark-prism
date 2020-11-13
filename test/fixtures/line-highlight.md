```html{2}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

```html{1,3-4,8}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
```

```tsx{13-19}
export default () => {
  // register current used theme
  const [theme, setTheme] = React.useState(themes.light);

  // handle the radio changes
  const handleChange = ({ target }) => {
    // based on the radio value, toggle to the correct theme
    return setTheme(themes[target.value]);
  };

  return (
    <ThemeProvider value={theme}>
      <Button>I am styled by theme context!</Button>
      <form onChange={handleChange}>
        <p>Please select your theme:</p>
        <input type="radio" id="light" name="theme" value="light" />
        <label for="light">Light</label>
        <input type="radio" id="dark" name="theme" value="dark" />
        <label for="dark">Dark</label>
      </form>
    </ThemeProvider>
  );
};
```
