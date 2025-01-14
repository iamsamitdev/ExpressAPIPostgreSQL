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
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Product: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            format: 'int64',
                            description: 'Product ID',
                        },
                        name: {
                            type: 'string',
                            description: 'Product Name',
                        },
                        price: {
                            type: 'number',
                            format: 'double',
                            description: 'Product Price',
                        },
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
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