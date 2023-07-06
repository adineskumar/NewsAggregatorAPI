const express = require("express");
const prefRoutes = express.Router();

const verifyToken = require("../../src/middlewares/auth.middleware.js");
const {
  getPreferences,
  updatePreferences,
} = require("../../src/controllers/preferences.controller.js");

prefRoutes.use(express.urlencoded({ extended: false }));
prefRoutes.use(express.json());

prefRoutes.get("/", verifyToken, getPreferences);

prefRoutes.put("/", verifyToken, updatePreferences);

module.exports = prefRoutes;