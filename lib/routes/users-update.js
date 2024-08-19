'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User, UserInformation, UserLocation } = require('../models');

function updateUserLocation(req, res, next) {
    const data = req.body;

    return UserLocation.findOneAndUpdate(
        { _id: data.userLocation.id },
        {
            country: data.userLocation.country,
            province: data.userLocation.province,
            city: data.userLocation.city,
            address: data.userLocation.address
        },
        { upsert: true, new: true }
    )
        .then((userLocation) => {
            req.body.userLocation = userLocation;
            return next();
        })
}

function updateUserInformation(req, res, next) {
    const data = req.body;

    return UserInformation.findOneAndUpdate(
        { _id: data.userInformation._id },
        {
            dni: data.dni,
            name: data.name,
            lastName: data.lastname,
            age: data.age,
        },
        { upsert: true, new: true }
    )
        .then((userInformation) => {
            req.body.userInformation = userInformation;
            return next();
        })
}

function updateUser(req, res) {
    const data = req.body;

    return User.findByIdAndUpdate(data.id, {
        email: data.email,
        color: data.color,
        userLocation: data.userLocation._id,
        userInformation: data.userInformation._id,
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
    '/users',
    updateUserLocation,
    updateUserInformation,
    updateUser
);

module.exports = router;