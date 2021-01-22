const cspParserToStringFn = policyObject =>
    Object.entries(policyObject).map(([k, v]) => `${k}${v.length > 0 ? ' ' : ''}${v.join(' ')}`).join('; ');

export default cspParserToStringFn;
