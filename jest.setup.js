import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// see https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
Object.assign(global, { TextDecoder, TextEncoder });
