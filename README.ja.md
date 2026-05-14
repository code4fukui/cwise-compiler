# cwise-compiler

[
![build status](https://secure.travis-ci.org/scijs/cwise-compiler.png)
](http://travis-ci.org/scijs/cwise-compiler)

これは [`cwise`](https://github.com/scijs/cwise) ライブラリの内部コンパイラです。解析済みの cwise プロシージャを、[`ndarrays`](https://github.com/scijs/ndarray) を処理する最適化されたループ関数に変換します。

**注意:** このモジュールは上級者向けです。通常は、パースとコンパイルを自動的に処理するメインの `cwise` ライブラリを使用してください。パフォーマンス上の理由から `cwise-parser` と `esprima` をバイパスする必要がある場合にのみ、直接使用することを推奨します。

## インストール
[npm](https://www.npmjs.com/) を使用してインストールします:

```bash
npm install cwise-compiler
```

## 使い方
以下の例では、大きな `ndarray` のサブ配列に対してドット積を実行する関数をコンパイルする方法を示します。

```javascript
import parse from "cwise-parser"
import compile from "cwise-compiler"
import ndarray from "ndarray"

// 1. 要素ごとの操作を定義して解析
const body = parse(function(a, b) {
  a = b[0][0]*b[1][0] + b[0][1]*b[1][1] + b[0][2]*b[1][2]
})

// 2. 解析済みプロシージャでコンパイラを構成
const compiledFunc = compile({
  args: ["array", {blockIndices: -2}],
  pre: parse(function() {}),
  body: body,
  post: parse(function() {}),
  debug: false,
  funcName: "cwise",
  blockSize: 64
})

// 3. コンパイルされた関数をndarrayに適用
const arrayA = ndarray(new Float32Array(12), [3, 4])
const arrayB = ndarray(new Float32Array(72), [3, 4, 2, 3]) // データで初期化

// ... arrayBにデータを初期化 ...

compiledFunc(arrayA, arrayB)

console.log(arrayA.data)
```

## API
#### `require("cwise-compiler")(procedure)`
`cwise` プロシージャオブジェクトを実行可能な関数にコンパイルします。`procedure` オブジェクトには以下のフィールドが必要です:

*   `args`: 引数の型を指定する `Array`。`"array"`、`"scalar"`、`"index"`、`"shape"` のような文字列、または `{blockIndices: ...}` や `{offset: ...}` のようなより複雑な型を指定するオブジェクトを使用できます。
*   `pre`: メインループの前に実行される、`cwise-parser` で解析済みの関数。配列引数を参照することはできません。
*   `body`: 内部ループで実行される要素ごとのロジックを含む、`cwise-parser` で解析済みの関数。
*   `post`: メインループの後に実行される、`cwise-parser` で解析済みの関数。配列引数を参照することはできません。
*   `funcName`: 生成される関数の名前を指定する `String`。
*   `blockSize`: キャッシュ最適化に使用される、ループのブロックサイズを指定する `Integer`（デフォルト: `64`）。
*   `debug`: `Boolean` フラグ。`true` の場合、生成された関数のソースコードがコンソールに出力されます。

## ライセンス
MIT License — [LICENSE](LICENSE) を参照してください。
