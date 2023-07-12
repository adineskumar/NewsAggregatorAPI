const express = require('express');
const prefRoutes = require('express').Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const { verifyToken } = require("../middlewares/auth.middleware");
const { getPreferences, updatePreferences } = require('../controllers/preference.controller');

prefRoutes.use(cors());
prefRoutes.use(bodyParser.urlencoded({ extended: false }));
prefRoutes.use(bodyParser.json());

prefRoutes.get('/', verifyToken, getPreferences);
prefRoutes.put('/', verifyToken, updatePreferences);

module.exports = prefRoutes;