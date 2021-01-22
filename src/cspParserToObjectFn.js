const cspParserToObjectFn = policyString =>
    policyString.split(';').reduce((result, directive) => {
        const [directiveKey, ...directiveValue] = directive.trim().split(/\s+/g);

        if (directiveKey && !Object.prototype.hasOwnProperty.call(result, directiveKey)) {
            result[directiveKey] = directiveValue;
        }

        return result;
    }, {});

export default cspParserToObjectFn;
