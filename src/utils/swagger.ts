import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import dotenv from 'dotenv'

dotenv.config()

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ExpressJS with PostgreSQL API',
            version: '1.0.0',
            description: 'API Documentation for ExpressJS with PostgreSQL',
        },
        servers: [
            {
                url: `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`,
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        description: "The user ID",
                        example: 1,
                      },
                      username: {
                        type: "string",
                        description: "The user's username",
                        example: "john_doe",
                      },
                      password: {
                        type: "string",
                        description: "The user's hashed password",
                        example: "$2a$12$abcdefghijk",
                      },
                      fullname: {
                        type: "string",
                        description: "The user's full name",
                        example: "John Doe",
                      },
                      email: {
                        type: "string",
                        description: "The user's email address",
                        example: "john.doe@example.com",
                      },
                      tel: {
                        type: "string",
                        description: "The user's telephone number",
                        example: "0812345678",
                      },
                    },
                },
                Product: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                        description: "The product ID",
                        example: 1,
                      },
                      name: {
                        type: "string",
                        description: "The product name",
                        example: "iPhone 12 Pro Max",
                      },
                      price: {
                        type: "integer",
                        description: "The price of product",
                        example: "1000",
                      },
                    },
                },
            }
        },
        security: [
            {
              BearerAuth: [],
            },
        ],
    },
    apis: [
        './src/routes/*.ts',
        './dist/routes/*.js',
        './src/**/*.ts',
    ],
}

const swaggerSpec = swaggerJSDoc(options)

const setupSwagger = (app: Express): void => {
    app.use('/api-docs', (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();    
    })

    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
          customSiteTitle: 'ExpressJS with PostgreSQL API',
          explorer: true,
          swaggerOptions: {
            filter: true,
            showRequestHeaders: true,
          },
        })
    )
}

export default setupSwagger