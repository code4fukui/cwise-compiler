import parse from "cwise-parser"
import compile from "./compiler.js";
import ndarray from "ndarray"

const body23 = parse(function(a,b) {
  a = b[0][0]*b[1][0]+b[0][1]*b[1][1]+b[0][2]*b[1][2]
})

// Multiple block indices
const c = compile({
  args: ["array", {blockIndices: -2}],
  pre: parse(function() {}),
  body: body23,
  post: parse(function() {}),
  debug: false,
  funcName: "cwise",
  blockSize: 64
})
const a = ndarray([1,2,3,4,5,6,7,8,9,10,11,12], [3,4])
const b = ndarray([48,46,89,64,72,96,38,37,79,92,89,62,84,41,13,81,53,30,68,78,34,81,90,50,
                  82,97,46,18,11,79,15,68,88,58,71,84,76,35,74,82,27,47,59,25,78,61,10,43,
                  96,59,21,74,41,67,11,72,38,62,95,66,57,44,93,10,51,59,50,85,71,41,79,45], [3,4,2,3])
const ref = ndarray([14928,11687,9367,14228,6177,13090,10655,7203,10930,10030,8301,11960], [3,4])

c(a, b);
console.log(a, ref);
