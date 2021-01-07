Simple Content-Security-Policy (CSP) parser written with vanilla JavaScript

The parser is without warranty, written not for a production because has no tests.

If you need CSP parser more for production and with tests you can check https://github.com/helmetjs/content-security-policy-parser

# How to use
You can see an example here https://stackblitz.com/edit/js-cyr7kf?file=index.js
```js
import { CspParser, CspDirective } from "./CspParser.js";

const policy = "default-src 'self'; script-src 'unsafe-eval' scripts.com scripts-that-will-be-removed.com scripts-that-will-be-removed-2.com scripts-that-will-be-removed-starts-with.com scripts-that-will-be-removed-ends-with.com example-to-be-deleted-by-reg-exp.com; object-src; style-src example.com";

const parser = new CspParser(el.value);

// add a new value, you can use few values in all form of addValue or removeValue methods
parser.addValue(
    CspDirective.SCRIPT_SRC,
    "added-script.com",
    "added-script-2.com",
    "added-script-3.com"
);

// remove values by names ot regular expressions
parser.removeValue(CspDirective.SCRIPT_SRC,
    "scripts-that-will-be-removed.com",
    "scripts-that-will-be-removed-2.com"
);
parser.removeValueStartsWith(CspDirective.SCRIPT_SRC, "scripts-that-will-be-removed-starts-with.com");
parser.removeValueEndsWith(CspDirective.SCRIPT_SRC, "scripts-that-will-be-removed-ends-with.com");
parser.removeValueByRegEx(CspDirective.SCRIPT_SRC, /example.+reg-exp.com/);

// Parse to string
parser.toPolicyString();
/*  Result is

    default-src 'self'; script-src 'unsafe-eval' scripts.com added-script.com added-script-2.com added-script-3.com; object-src; style-src example.com
*/

```