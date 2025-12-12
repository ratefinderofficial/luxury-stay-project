const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LuxuryStay HMS API',
      version: '1.0.0',
      description: 'API Documentation for Hotel Management System',
      contact: {
        name: 'Developer Support',
        email: 'dev@luxurystay.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
    ],
    // JWT Auth Button add karne ke liye
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Kahan se routes read kare?
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;