'use strict';
const UsersGetOne = require('./users-get-findById');
const UsersGet = require('./users-get-findAll');
const UsersPost = require('./users-post-saveUser');
const UsersPostDisable = require('./users-post-disable');
const UsersPut = require('./users-put-updateUserLocation');

module.exports = {
    UsersGetOne,
    UsersGet,
    UsersPost,
    UsersPostDisable,
    UsersPut
};
