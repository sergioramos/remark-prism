```diff
@@ -4,6 +4,5 @@
-  let foo = bar.baz([1, 2, 3]);
-  foo = foo + 1;
+  const foo = bar.baz([1, 2, 3]) + 1;
   console.log(`foo: ${foo}`);
```

```diff[class="diff-highlight"]
@@ -4,6 +4,5 @@
-  let foo = bar.baz([1, 2, 3]);
-  foo = foo + 1;
+  const foo = bar.baz([1, 2, 3]) + 1;
   console.log(`foo: ${foo}`);
```

```diff-javascript[class="diff-highlight"]
@@ -4,6 +4,5 @@
-  let foo = bar.baz([1, 2, 3]);
-  foo = foo + 1;
+  const foo = bar.baz([1, 2, 3]) + 1;
   console.log(`foo: ${foo}`);
```
