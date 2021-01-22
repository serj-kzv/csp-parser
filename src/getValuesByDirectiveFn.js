const getValuesByDirectiveFn = (policyObject, cspDirective) => {
    const policyEntry = Object.entries(policyObject).find(([k]) => k === cspDirective);

    return policyEntry === undefined ? undefined : policyEntry[1];
};

export default getValuesByDirectiveFn;
