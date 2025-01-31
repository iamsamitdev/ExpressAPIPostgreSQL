// Express
import express from 'express'
// Dotenv
import dotenv from 'dotenv'

// Import CORS
import cors from 'cors'

// Import Routes
import dbtestRoutes from './routes/dbtestRoutes'
import productRoutes from './routes/productRoutes'
import userRoutes from './routes/userRoutes'

// Import Swagger
import setupSwagger from './utils/swagger'

// Load environment variables
dotenv.config()

// Create Express server
const app = express()

// Middleware for CORS
app.use(cors(
  {
    // origin: 'http://localhost:4200, http://www.example.com',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
))

// Middleware for parsing application/json
app.use(express.json())

// Setup Swagger
setupSwagger(app)

// Use Routes
app.use('/api/testdb', dbtestRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)

// Start Express server
app.listen(process.env.PORT, () => {
  console.log(`Server started on http://${process.env.HOST}:${process.env.PORT}`)
})
