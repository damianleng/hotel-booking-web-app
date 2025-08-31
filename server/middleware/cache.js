const redis = require("./redis");

exports.cache = (ttl, keyFn) => async (req, res, next) => {
  try {
    const key = keyFn(req);
    const cached = await redis.get(key);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.json(JSON.parse(cached));
    }
    res.locals._cacheKey = key;
    res.locals._ttl = ttl;
    res.set("X-Cache", "MISS");
    return next();
  } catch (err) {
    console.error("Cache error:", err);
    return next();
  }
};

exports.store = async (req, res, payload) => {
  try {
    if (res.locals._cacheKey) {
      await redis.setex(res.locals._cacheKey, res.locals._ttl, JSON.stringify(payload));
    }
  } catch (err) {
    console.error("Cache store error:", err);
  }
};
