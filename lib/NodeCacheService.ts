// cache.ts
import NodeCache from "node-cache";

// Default check period: 120s, std TTL: 0 (we'll define TTL per key)
const cache = new NodeCache({ stdTTL: 0, checkperiod: 120 });

export default cache;
