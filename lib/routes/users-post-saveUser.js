'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User, UserInformation } = require('../models');
const Joi = require('joi');

// En la ruta POST /api/users quedó comentada como “TODO” la función que debería validar que el body enviado sea correcto antes de guardarlo. 
// De no cumplir la validación se debe retornar status 400. Se debe hacer esa validación usando la librería Joi (https://joi.dev). 

/**
 * @openapi
 * /api/users/saveUser:
 *   post:
 *     tags:
 *       - User controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              color:
 *                type: string
 *                default: red 
 *              email:
 *                type: string
 *                default: user@example.com
 *              dni:
 *                type: string
 *                default: 12345678
 *              name:
 *                type: string
 *                default: agustin
 *              lastname:
 *                type: string
 *                default: nava
 *              age:
 *                type: string
 *                default: 30
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Error
 */
const schema = Joi.object({
    color: Joi.string()
        .valid('red', 'green', 'blue'),

    email: Joi.string()
        .required()
        .messages({
            'any.required': 'email is a required field',
        }),

    dni: Joi.string()
        .required()
        .messages({
            'any.required': 'dni is a required field',
        }),

    name: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'name has to be least 3 characters.',
            'any.required': 'name is a required field',
        }),

    lastName: Joi.string()
        .required()
        .messages({
            'any.required': 'lastName is a required field',
        })
})

function validateFields(req, res, next) {
    // TODO:
    // - name: string, al menos 3 caracteres
    // - color: string, uno de estos valores: "red", "green", "blue"
    // - email: string
    // Ver los campos que son requeridos
    const data = req.body;

    const validation = schema.validate({
        color: data.color,
        email: data.email,
        dni: data.dni,
        name: data.name,
        lastName: data.lastname,
    })

    if (validation.error) {
        return res.status(400).json({
            code: 'bad_request',
            message: validation.error.message
        });
    }

    return next();
}

function createUserInformation(req, res, next) {
    // Crear modelo UserInformation relacionado a User
    const data = req.body;

    return UserInformation.create({
        dni: data.dni,
        name: data.name,
        lastName: data.lastname,
        age: data.age,
    })
        .then((userInformation) => {
            req.body.userInformation = userInformation;
            return next();
        })
}

function saveUser(req, res) {
    const data = req.body;

    return User.create({
        email: data.email,
        color: data.color,
        userInformation: data.userInformation.id,
    })
        .then((user) => {
            return res.status(201).json(user.toJSON());
        })
        .catch((error) => {
            logger.error(`POST /users/saveUser - saveUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.post(
    '/users/saveUser',
    validateFields,
    createUserInformation,
    saveUser
);

module.exports = router;
