import express from "express"
import * as userController from "../controllers/userController"

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: API for users in the system
 */

/**
 * @swagger
 * /api/users/register:
 *  post:
 *    summary: Register a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              fullname:
 *                type: string
 *              email:
 *                type: string
 *              tel:
 *                type: string
 *    responses:
 *      201:
 *        description: User registered successfully
 */
router.post("/register", userController.registerUser)

/**
 * @swagger
 * /api/users/login:
 *  post:
 *    summary: Login to the system
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: User logged in successfully
 */
router.post("/login", userController.loginUser)

/**
 * @swagger
 * /api/users/refresh-token:
 *  post:
 *    summary: Refresh an access token
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              refreshToken:
 *                 type: string
 *                 description: The refresh token
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *    responses:
 *      201:
 *        description: Access token refreshed successfully
 *        content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 refreshToken:
 *                  type: string
 *                  description: The refresh token
 *                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
router.post('/refresh-token', userController.refreshToken)

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: "refreshToken Token for Logout"
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Refresh token is required
 */
router.post('/logout', userController.logoutUser)

export default router
