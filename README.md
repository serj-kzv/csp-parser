Simple Content-Security-Policy (CSP) parser written with vanilla JavaScript

The parser is without warranty, written not for a production because has no tests.

If you need CSP parser more for production and with tests you can check https://github.com/helmetjs/content-security-policy-parser

# How to use

```js
import { CspParser, CspDirective } from "./CspParser.js";

const policy = "default-src 'self'; script-src 'unsafe-eval' scripts.com; object-src; style-src example.com";
const parser = new CspParser(policy);

```