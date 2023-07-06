const express = require("express");
const newsRoutes = require('express').Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const verifyToken = require("../../src/middlewares/auth.middleware.js");
const { getNews, getTopNews } = require("../../src/controllers/news.controller.js");

newsRoutes.use(cors());
newsRoutes.use(bodyParser.urlencoded({ extended: false }));
newsRoutes.use(bodyParser.json());


newsRoutes.get("/", verifyToken, getNews);
newsRoutes.get("/top", verifyToken, getTopNews);

module.exports = newsRoutes;