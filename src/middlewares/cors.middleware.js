const supabase = require("../config/supabase");

const allowedOriginsCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const isLocalhost = (origin) => {
    return origin?.includes('localhost') || origin?.includes('127.0.0.1');
};

const isValidOrigin = async (origin) => {
    const domain = new URL(origin).hostname;

    // Check cache
    const cached = allowedOriginsCache.get(domain);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL) {
        return cached.allowed;
    }

    const { data, error } = await supabase
        .from('chat_allowed_domains')
        .select('domain')
        .eq('domain', domain)
        .single();

    const allowed = !error && data;
    allowedOriginsCache.set(domain, { allowed, timestamp: now });
    return allowed;
};

const corsOptionsDelegate = async (req, callback) => {
    const origin = req.header('Origin');

    if (!origin) return callback(null, { origin: false });

    try {
        if (isLocalhost(origin)) {
            return callback(null, { origin: true });
        }

        const isAllowed = await isValidOrigin(origin);
        return callback(null, { origin: isAllowed });
    } catch (err) {
        console.error('Error al validar origen:', err);
        return callback(null, { origin: false });
    }
};

module.exports = corsOptionsDelegate;
