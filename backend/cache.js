const NodeCache = require('node-cache');

// Initialize cache with 60s standard TTL and check period of 120s
const cache = new NodeCache({
    stdTTL: 60,
    checkperiod: 120
});

// Cache statistics counter (Supplementary problem)
const cacheStats = {
    hits: 0,
    misses: 0
};

module.exports = {
    cache,
    cacheStats
};
