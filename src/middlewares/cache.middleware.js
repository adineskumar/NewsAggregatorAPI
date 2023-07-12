const NodeCache = require("node-cache");
const cache = new NodeCache();

module.exports = duration => (request, response, next) => {
    if (request.method !== "GET") {
        console.log("Cannot cache non-GET methods!");
        next();
    }
    
    const key = request.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        console.error(`Cache hit for ${key}`);
        response.status(200).json(JSON.parse(cachedResponse));
    } else {
        console.log(`Cache miss for ${key}`);
        response.originalSend = response.send;
        response.send = body => {
            response.originalSend(body);
            cache.set(key, body, duration);
        };
        next();
    }
}