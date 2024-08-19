'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User } = require('../models');

function findUserById(req, res) {
    const userId = req.params.id;

    return User.findById(userId)
        .populate('userLocation')
        .populate('userInformation')
        .then((user) => {
            return res.status(201).json(user);
        })
        .catch((error) => {
            logger.error(`GET /users - findUserById error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.get(
    '/users/:id',
    findUserById
);

module.exports = router;
