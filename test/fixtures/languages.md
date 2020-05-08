```html
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

```xml
<?xml version="1.0" encoding="UTF-8"?>
<text><![CDATA[Hello World]]></text>
```

```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="240" height="100" viewBox="0 0 240 100" zoomAndPan="disable">
  <title>Hello World</title>
    <g>
      <text x="10" y="50">Hello World</text>
      <animate attributeName="opacity" values="0;1" dur="4s" fill="freeze" begin="0s"/>
    </g>
</svg>
```

```css
body::before {
  content: 'Hello World';
}
```

```javascript
console.log('Hello World');
```

```abap
REPORT ZHELLO_WORLD.

START-OF-SELECTION.
    WRITE: 'Hello World'.
```

```actionscript
package
{
	import flash.display.Sprite;
	import flash.text.TextField;

	public class actionscript extends Sprite
	{
		private var hello:TextField = new TextField();

		public function actionscript(){
			hello.text = "Hello World";
			addChild(hello);
		}
	}
}
```

```ada
with Text_IO;
procedure Hello_World is
	begin
		Text_IO.Put_line("Hello World");
	end Hello_World;
```

```apl
⎕←'Hello World'
```

```applescript
display dialog "Hello World"
```

```arduino
void setup() {
  Serial.begin(9600);
  Serial.println("Hello World");
}

void loop() {

}
```

```autohotkey
MsgBox, Hello World
```

```autoit
MsgBox(0, "Message Box", "Hello World")
```

```bash
#!/bin/bash

echo Hello World
```

```shell
#!/bin/sh
echo "Hello World"
```

```basic
10 PRINT "Hello World"
20 END
```

```batch
@echo off
echo Hello World
```

```brainfuck
-[------->+<]>-.-[->+++++<]>++.+++++++..+++.[--->+<]>-----.---[->+++<]>.-[--->+<]>---.+++.------.--------.
```

```c
#include <stdio.h>

int main() {
	printf("Hello World\n");
	return 0;
}
```

```csharp
class HelloWorld {
	static void Main() {
		System.Console.WriteLine("Hello World");
	}
}
```

```cpp
#include <iostream>

using namespace std;

int main()
{
   cout << "Hello World\n";
}
```

```cil
// ilasm cil.il
.assembly HelloWorld {}
.method public static void Main() cil managed
{
     .entrypoint
     .maxstack 1
     ldstr "Hello World"
     call void [mscorlib]System.Console::WriteLine(string)
     ret
}
```

```coffeescript
alert "Hello World"
```

```clojure
(println "Hello World")
```

```crystal
puts "Hello World"
```

```d
// Hello World in D
import std.stdio;

void main()
{
	   writeln("Hello World");
}
```

```dart
main() {
  print('Hello World');
}
```

```eiffel
indexing "Hello World in Eiffel , from http://roesler-ac.de/wolfram/hello.htm#Eiffel"

class HELLO

creation
	run

feature

	run is
		local
			io : BASIC_IO;
		do
			!!io;
			io.put_string("Hello World");
			io.put_newline
		end; -- run
end; -- class HELLO
```

```elixir
 IO.puts "Defining the function world"
```

```elm
import Html exposing (text)

main =
  text "Hello World"
```

```erlang
-module(erlang_hw).
-export([start/0]).

start() ->
  io:format("Hello World~n").
```

```fsharp
printfn "Hello World"
```

```factor
USING: io ;
"Hello World" print
```

```fortran
program helloworld
print *,'Hello World'
end program helloworld
```

```gdscript
extends Label

func _ready():
  self.text = "Hello World"
```

```gml
draw_text(1, 1, "Hello World");
```

```go
package main

import "fmt"

func main() {
  fmt.Println("Hello World")
}
```

```graphql
{
    "Hello World"
}
```

```groovy
println "Hello World"
```

```haml
%html
  %title Hello World
  %body
    %h1 Hello World
```

```hs
module Main where

main = putStrLn "Hello World"
```

```haxe
class HelloWorld {
    static function main() {
        trace("Hello World");
    }
}
```

```icon
procedure main()
    write("Hello World");
end
```

```io
"Hello World\n" print
```

```j
#!/opt/local/bin/jc
echo 'Hello World'
exit ''
```

```java
public class Java {
	public static void main(String[] args) {
		System.out.println("Hello World");
	}
}
```

```json
{ "hello": "world" }
```

```julia
println("Hello World")
```

```kotlin
package hello

fun main() {
  println("Hello World")
}
```

```latex
\documentclass{article}
\begin{document}
Hello World
\end{document}
```

```less
body::before {
  content: 'Hello World!';
}
```

```lisp
; LISP
(DEFUN hello ()
  (PRINT (LIST 'HELLO 'WORLD))
)

(hello)
```

```emacs-lisp
;;for emacs elisp

(message "hello,world")
```

```livescript
console.log "Hello World"
```

```llvm
; llvm-as llvm.ll
; x86 assembly: llc llvm.bc -o llvm.s -march x86
; interpreter: lli llvm.bc

target datalayout = "e-p:32:32:32-i1:8:8-i8:8:8-i16:16:16-i32:32:32-i64:32:64-f32:32:32-f64:32:64-v64:64:64-v128:128:128-a0:0:64-f80:128:128"
@.str = internal constant [12 x i8] c"Hello World\00"

; puts from libc
declare i32 @puts(i8*)

define i32 @main(...) {
	call i32 @puts(i8* getelementptr([12 x i8]* @.str, i32 0, i32 0))
	ret i32 0
}
```

```lolcode
HAI
CAN HAS STDIO?
VISIBLE "Hello World"
KTHXBYE
```

```lua
print("Hello World")
```

```markdown
# Hello World
```

```matlab
disp('Hello World')
```

```mel
proc helloWorld () {
   print "Hello World\n";
}
helloWorld;
```

```moonscript
print 'Hello World'
```

```nasm
section	.text
    global _start			;must be declared for linker (ld)

_start:					;tell linker entry point

	xor	ebx,ebx 	;ebx=0
	mov	ecx,msg		;address of message to write
	lea	edx,[ebx+len]	;message length
	lea	eax,[ebx+4]	;system call number (sys_write)
	inc	ebx		;file descriptor (stdout)
	int	0x80		;call kernel

	xor	eax, eax	;set eax=0
	inc	eax		;system call number (sys_exit)
	int	0x80		;call kernel

section	.rodata

msg	db	'Hello, world!',0xa	;our string
len	equ	$ - msg			;length of our string
```

```nim
echo("Hello World")
```

```objectivec
/*
 Build on OS X:
 clang -framework Foundation -fobjc-arc objc.m -o objc

 Build on Linux with GNUstep:
 clang `gnustep-config --objc-flags` `gnustep-config --base-libs` -fobjc-nonfragile-abi -fobjc-arc objc.m -o objc
 */

#import <Foundation/Foundation.h>

int main(void)
{
    NSLog(@"Hello World");
}
```

```ocaml
print_string "Hello World\n"
```

```oz
{Show 'Hello World'}
```

```parser
@main[]
  ^rem{Will print "Hello World" when run as CGI script}
  $hello[Hello World]
  $result[$hello]
```

```pascal
program HelloWorld(output);
begin
        writeln('Hello World');
end.
```

```objectpascal
program ObjectPascalExample;

type
   THelloWorld = class
      procedure Put;
   end;

procedure THelloWorld.Put;
begin
   Writeln('Hello World');
end;

var
   HelloWorld: THelloWorld;

begin
   HelloWorld := THelloWorld.Create;
   HelloWorld.Put;
   HelloWorld.Free;
end.
```

```perl
   #!/usr/local/bin/perl -w
   use CGI;                             # load CGI routines
   $q = CGI->new;                        # create new CGI object
   print $q->header,                    # create the HTTP header
         $q->start_html('Hello World'), # start the HTML
         $q->h1('Hello World'),         # level 1 header
         $q->end_html;                  # end the HTML

 # http://perldoc.perl.org/CGI.html
```

```php
<?php

echo 'Hello World';
```

```plsql
begin
  dbms_output.put_line('Hello World');
end;
/
```

```powershell
'Hello World'
```

```processing
size(128, 128);
background(0);
textAlign(CENTER, CENTER);
fill(255);
text("Hello World", width / 2, height / 2);
```

```prolog
helloWorld :-
  write('Hello World').

:- helloWorld.
```

```pug
doctype html
html
    head
       title Hello World
    body
       h1 Hello World
```

```pure
module Main where

import Debug.Trace

main = trace "Hello World"
```

```purebasic
If OpenConsole()
  PrintN("Hello World")
EndIf
```

```python
#!/usr/bin/env python
print "Hello World"
```

```q
"Hello World"
```

```qore
#!/usr/bin/env qore
%exec-class HelloWorld
class HelloWorld
{
    constructor()
    {
	    background $.say("Hello World");
    }
    private say($arg)
    {
	    printf("%s\n", $arg);
    }
}
```

```r
cat("Hello World\n")
```

```racket
#lang racket
"Hello World"
```

```reason
print_string "Hello World"
```

```ruby
#!/usr/bin/env ruby
puts "Hello World"
```

```rust
fn main() {
    println!("Hello World");
}
```

```sas
%macro putit( string= );
     %put &string;
     %mend;

%putit(string=Hello World)
```

```sass
body::before
	content: "Hello World"
```

```scala
object HelloWorld extends App {
  println("Hello World")
}
```

```scheme
(display "Hello World") (newline)
```

```shell-session
#!/bin/sh
echo "Hello World"
```

```smalltalk
Transcript show: 'Hello World'.
```

```solidity
pragma solidity ^0.6.4;

contract HelloWorld {
    function render () public pure returns (string memory) {
        return 'Hello World';
    }
}
```

```sparql
SELECT ?h WHERE {
  VALUES ?h { "Hello World" }
}
```

```sql
SELECT 'Hello World';
```

```stylus
body::before
	content: "Hello World"
```

```swift
print("Hello World")
```

```tcl
puts "Hello World"
```

```typescript
console.log('Hello World');
```

```vala
static void main (string[] args)
{
	stdout.printf ("Hello World\n");
}

```

```vbnet
Module HelloWorld
    Sub Main()
        System.Console.WriteLine("Hello World")
    End Sub
End Module
```

```verilog
module main;
  initial
    begin
      $display("Hello World");
      $finish;
    end
endmodule
```

```vhdl
use std.textio.all;

entity hello_world is
end hello_world;

architecture behaviour of hello_world is
begin
	process
    begin
       write (output, String'("Hello World"));
       wait;
    end process;
end behaviour;
```

```vim
echo "Hello World"
```

```visual-basic
Module HelloWorld
    Sub Main()
        MsgBox("Hello World")
    End Sub
End Module
```

```wiki
Hello World
```

```xquery
let $hello := "Hello World"
return $hello
```

```yaml
hello: world
```
