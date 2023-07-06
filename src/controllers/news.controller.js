const axios = require("axios");
const { NEWSAPI_KEY } = require("../../src/config/env.js");
const { ERR_SERVER_ERROR, ERR_USER_NOT_FOUND } = require("../../src/constants/app.constants.js");
const User = require('../../src/schemas/users.schema.js');
const urlSearchParams = require('url-search-params');

const PREFIX_NEWS_SOURCES = "news-sources";
const PREFIX_NEWS_CATEGORY = "news-category";
const URI_NEWSAPI_EVERYTHING = "https://newsapi.org/v2/everything";
const URI_NEWSAPI_TOP = "https://newsapi.org/v2/top-headlines";

const getNews = async function(request, response) {
  User.findOne({ id: request._id }).then(user => {
    if (!user) {
      return response.status(400).json(ERR_USER_NOT_FOUND);
    }
    console.log(user);
    const sources = user.preferences.sources.join(",")

    
    var params = new urlSearchParams({ apiKey: NEWSAPI_KEY });
    if (sources) {
      var params = new urlSearchParams({ sources, apiKey: NEWSAPI_KEY });
    }
    
    const request_url = `${URI_NEWSAPI_EVERYTHING}?${params.toString()}`;
    console.log(request_url);
    news_response = axios.get(request_url)
      .then(news_data => {
        console.log(news_data.status);
        return response.status(200).json(news_data.data.articles);
      })
      .catch(error => {
        console.log(error);
        return response.status(500).json(ERR_SERVER_ERROR);
      });
  }).catch(err => {
    console.log(err);
    return response.status(500).json(ERR_SERVER_ERROR);
  });
};

const getTopNews = async function(request, response) {
  User.findOne({ id: request._id }).then(user => {
    if (!user) {
      return response.status(400).json(ERR_USER_NOT_FOUND);
    }
    console.log(user);
    const category = user.preferences.category.join(",");    
    var params = new urlSearchParams({ apiKey: NEWSAPI_KEY });
    if (category) {
      var params = new urlSearchParams({ category, apiKey: NEWSAPI_KEY });
    } 
    const request_url = `${URI_NEWSAPI_TOP}?${params.toString()}`;
    console.log(request_url);
    news_response = axios.get(request_url)
      .then(news_data => {
        console.log(news_data.status);
        return response.status(200).json(news_data.data.articles);
      })
      .catch(error => {
        console.log(error);
        return response.status(500).json(ERR_SERVER_ERROR);
      });
  }).catch(err => {
    console.log(err);
    return response.status(500).json(ERR_SERVER_ERROR);
  });
};

module.exports = { getNews, getTopNews };