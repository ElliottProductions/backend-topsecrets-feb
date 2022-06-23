const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
// const User = require('../models/User');
// const UserService = require('../services/UserService');

module.exports = Router()
  .get('/', authenticate, async (req, res) => {
    const secrets = await Secret.getAll();
    res.json(secrets);
  });
