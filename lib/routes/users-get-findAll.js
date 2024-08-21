'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User } = require('../models');

//* Nueva ruta para obtener usuarios
// Se debe crear una nueva ruta GET /api/users que retorne un listado de usuarios guardados en la base de datos.
// Se debe permitir filtrar por medio de un parámetro query los usuarios habilitados o deshabilitados (campo “enabled”).
// Se debe permitir indicar, por medio de un parámetro query, un campo para ordenar. 

/**
 * @openapi
 * /api/users/getAllusers:
 *   get:
 *     tags:
 *       - User controller
 *     parameters:
 *       - in: query
 *         name: enabled
 *         schema:
 *           type: boolean
 *         description: user status
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: order by a field (email or color)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/components/schemas/User'
 */
function getAllusers(req, res) {
    let filter = {}

    if (req.query.enabled !== undefined) { filter = { ...filter, enabled: req.query.enabled } }

    return User.find(filter)
        .sort(req.query.orderBy)
        .then((users) => {
            return res.status(201).json(users);
        })
        .catch((error) => {
            logger.error(`GET /users - getAllusers error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.get(
    '/users/getAllUsers',
    getAllusers,
);

// /users/getAllUsers?enabled=true&orderBy=email

module.exports = router;
