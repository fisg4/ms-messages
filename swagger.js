const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const HOST = 'https://messages-fastmusik-marmolpen3.cloud.okteto.net';
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FastMusik Messages Microservice API',
      version: '1.0.0',
      description:
        'Specification of models and endpoints for communication and integration with the service offered by ms-messages.\n\n'
        + `Host: ${HOST}\n\n`
        + 'Base Path: /api/v1',
    },
    host: HOST,
    basePath: '/api/v1',
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
  },
  apis: ['./docs/**/*.yaml'],
};

const swaggerSpec = swaggerJSDoc(options);
const swaggerDocs = (app) => {
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = swaggerDocs;
