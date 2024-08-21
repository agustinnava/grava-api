'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User } = require('../models');
const user = require('../models/user');

//* Ruta para deshabilitar un usuario
// Se debe crear una nueva ruta POST /api/users/:id/disable que reciba en la url del id del usuario a eliminar.
// La ruta debe validar que exista el usuario y que esté habilitado (enabled=true), de no ser así debe retornar status 400.
// Si las validaciones son correctas, se debe marcar al usuario indicado como deshabilitado (enabled=false).

/**
 * @openapi
 * /api/users/{id}/disable:
 *   post:
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
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Error
 */
function validateUser(req, res, next) {
    const userId = req.params.id;

    User.findById(userId)
        .then((user) => {
            if (!user.enabled) {
                return res.status(400).json({
                    code: 'bad_request',
                    message: 'User is already disabled'
                });
            }
            return next()
        })
        .catch(() => {
            return res.status(400).json({
                code: 'bad_request',
                message: 'User not found'
            });
        })
}


function disableUser(req, res) {
    const userId = req.params.id;

    return User.findByIdAndUpdate(userId, {
        enabled: false
    })
        .then((user) => {
            return res.status(201).json({message: `${user.id} has been successfully disabled`});
        })
        .catch((error) => {
            logger.error(`POST /users/${req.params.id}/disable - disableUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post(
    '/users/:id/disable',
    validateUser,
    disableUser,
);

// users?enabled=true&orderBy=email

module.exports = router;