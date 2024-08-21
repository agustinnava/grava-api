'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User, UserLocation } = require('../models');
const mongoose = require('mongoose');

/**
 * @openapi
 * /api/users/{id}/updateUserLocation:
 *   put:
 *     tags:
 *       - User controller
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              country:
 *                type: string
 *                default: argentina 
 *              province:
 *                type: string
 *                default: buenos aires
 *              city:
 *                type: string
 *                default: san justo
 *              address:
 *                type: string
 *                default: calle 1234
 *     responses:
 *       200:
 *         description: OK
 */

function updateUserLocation(req, res, next) {
    const data = req.body;

    User.findById(req.params.id).then((userFound) => {
        console.log("entre", userFound.toString())
        return UserLocation.findOneAndUpdate(
            { _id: userFound.userLocation.id ? new mongoose.Types.ObjectId(userFound.userLocation.id) : new mongoose.Types.ObjectId() },
            {
                country: data.country,
                province: data.province,
                city: data.city,
                address: data.address
            },
            { upsert: true, new: true }
        )
            .then((userLocation) => {
                req.body.userLocation = userLocation;
                return next();
            })
    })
}

function updateUser(req, res) {
    const data = req.body;

    return User.findByIdAndUpdate(req.params.id, {
        userLocation: data.userLocation.id,
    })
        .then((user) => {
            return res.status(201).json(user);
        })
        .catch((error) => {
            logger.error(`POST /users - updateUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        });
}

router.put(
    '/users/:id/updateUserLocation',
    updateUserLocation,
    updateUser
);

module.exports = router;