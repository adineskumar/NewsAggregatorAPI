const { resolve } = require("path");
const urlSearchParams = require("url-search-params");
const axios = require("axios").default;
const redisClient = require("../clients/redis.client");
require("dotenv").config({ path : "src/.env"});
const {
    INTERNAL_SERVER_ERROR,
    URI_NEWSAPI_EVERYTHING,
    URI_NEWSAPI_TOP,
    CACHE_PREFIX_NEWS_SOURCES,
    CACHE_PREFIX_NEWS_CATEGORIES
} = require("../constants/app.constants");

async function getOrSetCache(key, callback, ...callbackArgs) {
    try {
        const data = await redisClient.get(key);
        if (data) {
            await redisClient.expire(key, process.env.REDIS_TTL);
            console.log("Retrieving from Redis cache");
            return await JSON.parse(data);
        }
        const dataToCache = await callback(...callbackArgs);
        console.log("Retrieving from External API");
        await redisClient.setex(key, process.env.REDIS_TTL, JSON.stringify(dataToCache));
        return await dataToCache
    } catch(error) {
        console.log(error);
    }
}

const getNews = async function (request, response) {
    try {
        const sources = request.user.preferences.sources.join(",");
        var params = new urlSearchParams({ apikey: process.env.NEWSAPI_KEY});
        if (sources) {
            var params = new urlSearchParams({ sources: sources, apikey: process.env.NEWSAPI_KEY});
        }
        const request_url = `${URI_NEWSAPI_EVERYTHING}?${params.toString()}`
        console.log(request_url);
        console.log(CACHE_PREFIX_NEWS_SOURCES);
        const news = await getOrSetCache(
            CACHE_PREFIX_NEWS_SOURCES,
            async() => {
                const newsResponse = await axios.get(request_url);
                return newsResponse.data.articles;
            }
        );
        return response.status(200).json(news);
    } catch(error) {
        console.log(error);
        return response.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
}

const getTopNews = async function (request, response) {    
    try {
        const categories = request.user.preferences.categories.join(",");
        var params = new urlSearchParams({ apikey: process.env.NEWSAPI_KEY});
        if (categories) {
            var params = new urlSearchParams({ category: categories, apikey: process.env.NEWSAPI_KEY});
        }
        const request_url = `${URI_NEWSAPI_TOP}?${params.toString()}`
        console.log(request_url);
        console.log(CACHE_PREFIX_NEWS_CATEGORIES);
        const news = await getOrSetCache(
            CACHE_PREFIX_NEWS_CATEGORIES,
            async() => {
                const newsResponse = await axios.get(request_url);
                return newsResponse.data.articles;
            }
        );
        return response.status(200).json(news);
    } catch(error) {
        console.log(error);
        return response.status(500).json({ message: INTERNAL_SERVER_ERROR });
    }
}


module.exports = { getNews, getTopNews };
