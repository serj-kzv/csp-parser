import {CspParser, CspDirective} from '../src/CspParser.js';

describe('CspParser',  () => {
    let cspParser;

    beforeEach(function() {
        const csp = "default-src 'self'; script-src 'unsafe-eval' scripts.com scripts-that-will-be-removed.com scripts-that-will-be-removed-2.com scripts-that-will-be-removed-starts-with.com scripts-that-will-be-removed-ends-with.com example-to-be-deleted-by-reg-exp.com; object-src; style-src example.com";
        cspParser  = new CspParser(csp);
    });

    it('parse to array', () => {
        let r = cspParser.getPolicy();
        expect(r[CspDirective.DEFAULT_SRC].length).toEqual(1);
    });
});
