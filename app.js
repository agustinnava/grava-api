'use strict';
const express = require('express');
const logger = require('./lib/logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./lib/routes');
const expressWinston = require('express-winston');
const app = express();
const cors = require('cors');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Grava-test-mongodb-api', version: '1.0.0' },
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            example: '66c23c32f39c18b20120636b'
                        },
                        email: {
                            type: 'string',
                            example: 'user@example.com'
                        },
                        color: {
                            type: 'string',
                            example: 'blue'
                        },
                        enabled: {
                            type: 'boolean',
                            example: false
                        },
                        userLocation: {
                            type: 'object',
                            description: 'Location details of the user'
                        },
                        userInformation: {
                            type: 'object',
                            description: 'Additional information about the user'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-08-18T18:23:46.995Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2024-08-19T18:28:08.937Z'
                        },
                        __v: {
                            type: 'integer',
                            example: 0
                        }
                    }
                }
            }
        }
    },
    apis: ['./lib/routes/*'],
};

// Docs in JSON format
const swaggerSpec = swaggerJSDoc(options);

function connectMongoose() {
    const mongoose = require('mongoose');
    mongoose.Promise = Promise;
    return mongoose.connect(
        `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
    );
}

function initialize() {
    app.use(expressWinston.logger({
        winstonInstance: logger,
        expressFormat: true,
        colorize: false,
        meta: false,
        statusLevels: true
    }));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    Object.keys(routes).forEach((key) => {
        app.use('/api', routes[key]);
    });

    app.use(function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function (err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        let error = {};
        error.status = err.status;
        if (req.app.get('env') === 'development') {
            error.message = err.message;
            error.stack = err.stack;
        }
        return res.status(err.status || 500).json({
            error
        });
    });

    return app;
}

module.exports = {
    initialize,
    connectMongoose
};
