# cwise-compiler

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

[
![build status](https://secure.travis-ci.org/scijs/cwise-compiler.png)
](http://travis-ci.org/scijs/cwise-compiler)

This is the internal compiler for the [`cwise`](https://github.com/scijs/cwise) library. It transforms a parsed cwise procedure into an optimized looping function over [`ndarrays`](https://github.com/scijs/ndarray).

**Note:** This module is intended for advanced use. In most cases, you should use the main `cwise` library, which handles parsing and compilation automatically. Direct use is only recommended if you need to bypass `cwise-parser` and `esprima` for performance-critical reasons.

## Install
Install using [npm](https://www.npmjs.com/):

```bash
npm install cwise-compiler
```

## Usage
This example demonstrates compiling a function that performs a dot product on sub-arrays of a larger `ndarray`.

```javascript
import parse from "cwise-parser"
import compile from "cwise-compiler"
import ndarray from "ndarray"

// 1. Define and parse the core element-wise operation
const body = parse(function(a, b) {
  a = b[0][0]*b[1][0] + b[0][1]*b[1][1] + b[0][2]*b[1][2]
})

// 2. Configure the compiler with the parsed procedure
const compiledFunc = compile({
  args: ["array", {blockIndices: -2}],
  pre: parse(function() {}),
  body: body,
  post: parse(function() {}),
  debug: false,
  funcName: "cwise",
  blockSize: 64
})

// 3. Apply the compiled function to ndarrays
const arrayA = ndarray(new Float32Array(12), [3, 4])
const arrayB = ndarray(new Float32Array(72), [3, 4, 2, 3]) // Fill with data

// ... initialize arrayB with data ...

compiledFunc(arrayA, arrayB)

console.log(arrayA.data)
```

## API
#### `require("cwise-compiler")(procedure)`
Compiles a `cwise` procedure object into an executable function. The `procedure` object must have the following fields:

*   `args`: An `Array` of argument types. Can be strings like `"array"`, `"scalar"`, `"index"`, `"shape"`, or objects for more complex types like `{blockIndices: ...}` or `{offset: ...}`.
*   `pre`: A parsed function from `cwise-parser` to be executed before the main loop. Cannot reference array arguments.
*   `body`: A parsed function from `cwise-parser` containing the element-wise logic to be executed in the inner loop.
*   `post`: A parsed function from `cwise-parser` to be executed after the main loop. Cannot reference array arguments.
*   `funcName`: A `String` specifying the name for the generated function.
*   `blockSize`: An `Integer` for the loop block size, used for cache optimization (default: `64`).
*   `debug`: A `Boolean` flag. If `true`, the generated function's source code is printed to the console.

## License
MIT License — see [LICENSE](LICENSE).