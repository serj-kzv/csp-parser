import CspDirective from "./CspDirective.js";
import CspDirectiveValue from "./CspDirectiveValue.js";
import cspParserToObjectFn from "./cspParserToObjectFn.js";
import cspParserToStringFn from "./cspParserToStringFn.js";
import getValuesByDirectiveFn from "./getValuesByDirectiveFn.js";

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

    hasValue(cspDirective, value) {
        const foundValues = getValuesByDirectiveFn(this.policy, cspDirective);

        return foundValues === undefined ? false : foundValues.some(foundValue => foundValue === value);
    }

    addValue(cspDirective, ...values) {
        let foundValues = this.getValuesByDirective(cspDirective);

        if (!foundValues) {
            return this.policy[cspDirective] = [...values];
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

        this.addValue(cspDirective, ...policyEntryValues);
        if (policyEntryValues.length < 1) {
            // Allows all by default plus the value
            // See https://bugzilla.mozilla.org/show_bug.cgi?id=1086999
            this.addValue(
                currentDirective,
                CspDirectiveValue.ALL_WILD_CARD,
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
            this.removeValue(currentDirective, CspDirectiveValue.NONE);
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
