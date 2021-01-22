const CspDirectiveValue = Object.freeze({
    ALL_WILD_CARD: "*",
    NONE: "'none'",
    SELF: "'self'",
    UNSAFE_EVAL: "'unsafe-eval'",
    UNSAFE_INLINE: "'unsafe-inline'",
    BLOB_URI: 'blob:',
    DATA_URI: 'data:',
    FILESYSTEM_URI: 'filesystem:',
    MEDIASTREAM_URI: 'mediastream:',
});

export default CspDirectiveValue;
