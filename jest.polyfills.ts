import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "node:util";

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
});
