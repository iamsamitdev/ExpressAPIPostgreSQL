import express from "express"
import pool from "../utils/db"

// สร้าง router
const router = express.Router()

// ทดสอบการเชื่อมต่อฐานข้อมูล postgresql
/**
 * @swagger
 * tags:
 *  name: TestDB
 *  description: Test database connection
 */

/**
 * @swagger
 * /api/testdb:
 *   get:
 *     summary: Test database connection
 *     tags: [TestDB]
 *     responses:
 *       200:
 *         description: Connected to database successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get("/", async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT NOW()")
    client.release() // คืนค่า client ให้กับ pool เพือให้ client สามารถใช้ใหม่ได้ และปล่อยทรัพยากรที่ใช้ไป ให้กับ client อื่นใช้ได้

    res.status(200).json({
      message: "Connected to database successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Database connection failed",
      error: error,
    })
  }
})

export default router
