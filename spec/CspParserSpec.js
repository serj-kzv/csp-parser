import {CspParser, CspDirective} from '../src/CspParser.js';

describe('CspParser',  () => {
    let cspParser;

    beforeEach(function() {

    });

    it('parse to array', () => {
        const csp = "default-src 'self'; script-src 'unsafe-eval' scripts.com scripts-that-will-be-removed.com scripts-that-will-be-removed-2.com scripts-that-will-be-removed-starts-with.com scripts-that-will-be-removed-ends-with.com example-to-be-deleted-by-reg-exp.com; object-src; style-src example.com";

        cspParser  = new CspParser(csp);

        const parsedCsp = cspParser.getPolicy();

        expect(parsedCsp[CspDirective.DEFAULT_SRC].length).toEqual(1);
        expect(parsedCsp[CspDirective.SCRIPT_SRC].length).toEqual(7);
        expect(parsedCsp[CspDirective.OBJECT_SRC].length).toEqual(0);
        expect(parsedCsp[CspDirective.STYLE_SRC].length).toEqual(1);
    });


});
