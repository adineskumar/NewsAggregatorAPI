const express = require('express');
const newsRoutes = require('express').Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const { verifyToken } = require('../middlewares/auth.middleware')
const cache = require('../middlewares/cache.middleware')
const { getNews, getTopNews } = require('../controllers/news.controller');

newsRoutes.use(cors());
newsRoutes.use(bodyParser.urlencoded({ extended: false }));
newsRoutes.use(bodyParser.json());

newsRoutes.get('/', verifyToken, cache(900), getNews);
newsRoutes.get('/top', verifyToken, cache(900),  getTopNews);

module.exports = newsRoutes;