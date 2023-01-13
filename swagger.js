const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const PORT = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FastMusik Messages Microservice API',
      version: '1.0.0',
      description:
        'Specification of models and endpoints for communication and integration with the service offered by ms-messages.'
    },
    servers: [{
      url: 'https://messages-fastmusik-marmolpen3.cloud.okteto.net/api/v1',
      description: 'Production server'
    },
    {
      url: `http://localhost:${PORT}/api/v1`,
      description: 'Development server'
    },
    ],
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
