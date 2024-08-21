'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User } = require('../models');

/**
 * @openapi
 * /api/users/getUserById/{id}:
 *   get:
 *     tags:
 *       - User controller
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: user id
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal error
 */
function getUserById(req, res) {
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
    '/users/getUserById/:id',
    getUserById
);

module.exports = router;
