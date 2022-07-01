const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
// const User = require('../models/User');

module.exports = Router()
  .get('/', authenticate, async (req, res) => {
    const secrets = await Secret.getAll();
    res.json(secrets);
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const user = await Secret.insert(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  });
