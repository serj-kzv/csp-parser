const cspParserToObjectFn = policyString =>
    policyString.split(';').reduce((result, directive) => {
        const [directiveKey, ...directiveValue] = directive.trim().split(/\s+/g);

        if (directiveKey && !Object.prototype.hasOwnProperty.call(result, directiveKey)) {
            result[directiveKey] = directiveValue;
        }

        return result;
    }, {});
const cspParserToStringFn = policyObject =>
    Object.entries(policyObject).map(([k, v]) => `${k}${v.length > 0 ? ' ' : ''}${v.join(' ')}`).join('; ');

// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
const CspDirective = Object.freeze({
    CHILD_SRC: 'child-src',
    CONNECT_SRC: 'connect-src',
    DEFAULT_SRC: 'default-src',
    FONT_SRC: 'font-src',
    FRAME_SRC: 'frame-src',
    IMG_SRC: 'img-src',
    MANIFEST_SRC: 'manifest-src',
    MEDIA_SRC: 'media-src',
    OBJECT_SRC: 'object-src',
    PREFETCH_SRC: 'prefetch-src',
    SCRIPT_SRC: 'script-src',
    SCRIPT_SRC_ELEM: 'script-src-elem',
    SCRIPT_SRC_ATTR: 'script-src-attr',
    STYLE_SRC: 'style-src',
    STYLE_SRC_ELEM: 'style-src-elem',
    STYLE_SRC_ATTR: 'style-src-attr',
    WORKER_SRC: 'worker-src',
    BASE_URI: 'base-uri',
    PLUGIN_TYPES: 'plugin-types',
    SANDBOX: 'sandbox',
    FORM_ACTION: 'form-action',
    FRAME_ANCESTORS: 'frame-ancestors',
    NAVIGATE_TO: 'navigate-to',
    REPORT_URI: 'report-uri',
    REPORT_TO: 'report-to',
    BLOCK_ALL_MIXED_CONTENT: 'block-all-mixed-content',
    REFERRER: 'referrer',
    REQUIRE_SRI_FOR: 'require-sri-for',
    REQUIRE_TRUSTED_TYPES_FOR: 'require-trusted-types-for',
    TRUSTED_TYPES: 'trusted-types',
    UPGRADE_INSECURE_REQUESTS: 'upgrade-insecure-requests',
});
const CspDirectiveValue = Object.freeze({
    CSP_ALL_WILD_CARD: "*",
    NONE: "'none'",
    SELF: "'self'",
    UNSAFE_EVAL: "'unsafe-eval'",
    UNSAFE_INLINE: "'unsafe-inline'",
    BLOB_URI: 'blob:',
    DATA_URI: 'data:',
    FILESYSTEM_URI: 'filesystem:',
    MEDIASTREAM_URI: 'mediastream:',
});
const getValuesByDirectiveFn = (policyObject, cspDirective) => {
    const policyEntry = Object.entries(policyObject).find(([k]) => k === cspDirective);

    return policyEntry === undefined ? undefined : policyEntry[1];
};

class CspParser {
    constructor(policyString) {
        this.policy = cspParserToObjectFn(policyString);
    }

    getPolicy() {
        return this.policy;
    }

    toPolicyString() {
        return cspParserToStringFn(this.policy);
    }

    getValuesByDirective(cspDirective) {
        return getValuesByDirectiveFn(this.policy, cspDirective);
    }

    addValue(cspDirective, ...values) {
        let foundValues = this.getValuesByDirective(cspDirective);

        if (foundValues === undefined) {
            foundValues = this.policy[cspDirective] = [];
        }

        foundValues.push(...values);

        return foundValues;
    }

    addValueSmart(cspDirective, value, fallbackDirective = CspDirective.DEFAULT_SRC) {
        let currentDirective = cspDirective;
        let policyEntry = this.getValuesByDirective(currentDirective);

        if (policyEntry === undefined) {
            currentDirective = fallbackDirective;
            policyEntry = this.getValuesByDirective(currentDirective);
        }

        const policyEntryValues = policyEntry[1];

        this.addValue(cspDirective, ...policyEntryValues, value);
        this.removeValue(currentDirective, CspDirectiveValue.NONE);

        if (policyEntryValues.length < 1) {
            // Allows all by default plus the value
            // See https://bugzilla.mozilla.org/show_bug.cgi?id=1086999
            this.addValue(
                currentDirective,
                CspDirectiveValue.CSP_ALL_WILD_CARD,
                CspDirectiveValue.SELF,
                CspDirectiveValue.UNSAFE_EVAL,
                CspDirectiveValue.UNSAFE_INLINE,
                CspDirectiveValue.BLOB_URI,
                CspDirectiveValue.DATA_URI,
                CspDirectiveValue.FILESYSTEM_URI,
                CspDirectiveValue.MEDIASTREAM_URI,
                value
            );
        } else {
            this.addValue(currentDirective, value);
        }
    }

    removeValueBase(cspDirective, predicate, ...values) {
        const foundValues = this.getValuesByDirective(cspDirective);

        if (foundValues === undefined) {
            return undefined;
        }

        values.forEach(value => {
            const index = predicate(foundValues, value);

            if (index > -1) {
                foundValues.splice(index, 1);
            }
        });

        return foundValues;
    }

    removeValue(cspDirective, ...values) {
        return this.removeValueBase(cspDirective, (foundValues, value) => foundValues.indexOf(value), ...values);
    }

    removeValueStartsWith(cspDirective, ...values) {
        return this.removeValueBase(cspDirective, (foundValues, value) => foundValues.findIndex(foundValue => foundValue.startsWith(value)), ...values);
    }

    removeValueEndsWith(cspDirective, ...values) {
        return this.removeValueBase(cspDirective, (foundValues, value) => foundValues.findIndex(foundValue => foundValue.endsWith(value)), ...values);
    }

    removeValueByRegEx(cspDirective, ...values) {
        return this.removeValueBase(cspDirective, (foundValues, value) => foundValues.findIndex(foundValue => value.test(foundValue)), ...values);
    }

}

export {cspParserToObjectFn, cspParserToStringFn, CspDirective, CspDirectiveValue, getValuesByDirectiveFn, CspParser};
