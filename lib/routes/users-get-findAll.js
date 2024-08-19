'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User } = require('../models');

//* Nueva ruta para obtener usuarios
// Se debe crear una nueva ruta GET /api/users que retorne un listado de usuarios guardados en la base de datos.
// Se debe permitir filtrar por medio de un parámetro query los usuarios habilitados o deshabilitados (campo “enabled”).
// Se debe permitir indicar, por medio de un parámetro query, un campo para ordenar. 

function findAllUsers(req, res) {
    let filter = {}

    if (req.query.enabled !== undefined) { filter = { ...filter, enabled: req.query.enabled } }

    return User.find(filter)
        .sort(req.query.orderBy)
        .then((users) => {
            return res.status(201).json(users);
        })
        .catch((error) => {
            logger.error(`GET /users - findAllUsers error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.get(
    '/users',
    findAllUsers,
);

// users?enabled=true&orderBy=email

module.exports = router;
