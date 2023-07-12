const express = require('express');
const authRoutes = require('express').Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const { register, login } = require('../controllers/auth.controller');

authRoutes.use(cors());
authRoutes.use(bodyParser.urlencoded({ extended: false }));
authRoutes.use(bodyParser.json());

authRoutes.post('/register', register);
authRoutes.post('/login', login);

module.exports = authRoutes;