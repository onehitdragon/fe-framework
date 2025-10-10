import { arraysDiffSequence } from "./utils/arrays.js";

const oldArray = ["X", "A", "A", "B", "C"];
const newArray = ["C", "K", "A", "B"];

const result = arraysDiffSequence(oldArray, newArray, (a, b) => a == b);
console.log(result);
