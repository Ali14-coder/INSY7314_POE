// /server/middleware/validateRequest.js
const { getValidator } = require('../utils/validators');

function getByPath(obj, path) {
  if (!obj) return undefined;
  const parts = path.split('.');
  let cur = obj;
  for (let p of parts) {
    if (p.endsWith('[]')) {
      const arrName = p.slice(0, -2);
      cur = cur && cur[arrName];
      if (!Array.isArray(cur)) return undefined;
      return cur;
    } else {
      cur = cur && cur[p];
    }
    if (cur === undefined) return undefined;
  }
  return cur;
}

function applyPattern(value, pattern) {
  if (typeof pattern === 'function') return pattern(value);
  if (pattern instanceof RegExp) return pattern.test(String(value));
  return false;
}

function validateRequest(schema = {}) {
  return (req, res, next) => {
    try {
      const locations = ['params', 'query', 'body'];
      for (const loc of locations) {
        if (!schema[loc]) continue;
        const defs = schema[loc];
        for (const key of Object.keys(defs)) {
          const spec = defs[key];
          let patternSpec = spec;
          let optional = false;
          if (spec && typeof spec === 'object' && !(spec instanceof RegExp) && !(spec instanceof Function)) {
            patternSpec = spec.pattern;
            optional = !!spec.optional;
          }

          const validator = getValidator(patternSpec);
          const rawVal = getByPath(req[loc], key);

          if (key.includes('[]')) {
            const arr = rawVal;
            if (!arr) {
              if (!optional) return res.status(400).json({ error: `${loc}.${key} is required` });
              continue;
            }
            if (!Array.isArray(arr)) return res.status(400).json({ error: `${loc}.${key} must be an array` });

            for (const item of arr) {
              if (typeof patternSpec === 'string' && typeof item === 'object' && item !== null && item.hasOwnProperty(patternSpec)) {
                const v = item[patternSpec];
                if (!applyPattern(v, validator)) return res.status(400).json({ error: `${loc}.${key} element invalid (${patternSpec})` });
              } else {
                if (!applyPattern(item, validator)) return res.status(400).json({ error: `${loc}.${key} element invalid` });
              }
            }
            continue;
          }
          if (rawVal === undefined || rawVal === null || rawVal === '') {
            if (!optional) return res.status(400).json({ error: `${loc}.${key} is required` });
            else continue;
          }

          if (!validator) continue;

          if (!applyPattern(rawVal, validator)) {
            return res.status(400).json({ error: `${loc}.${key} failed validation` });
          }
        } 
      }

      next();
    } catch (err) {
      console.error('Validation middleware error', err);
      return res.status(500).json({ error: 'validation error' });
    }
  };
}

module.exports = validateRequest;
