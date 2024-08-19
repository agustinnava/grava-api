'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userLocationSchema = new Schema({
    country: {
        type: String,
        lowercase: true
    },
    province: {
        type: String,
        lowercase: true
    },
    city: {
        type: String,
        lowercase: true
    },
    address: {
        type: String,
        lowercase: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserLocation', userLocationSchema);
