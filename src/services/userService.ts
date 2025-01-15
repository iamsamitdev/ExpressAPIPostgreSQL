import pool from '../utils/db'
import User from '../models/userModel'

interface IUser {
    id: number
    username: string
    password: string
    fullname: string
    email: string
    tel: string
}

// สร้างฟังก์ชันสำหรับการลงทะเบียนผู้ใช้ใหม่ โดยสร้างฟังก์ชันชื่อ registerUser
export const registerUser = async (
    username: string, 
    password: string, 
    fullname: string, 
    email: string, 
    tel: string
): Promise<IUser> => {
    const client = await pool.connect()
    const result = await client.query('INSERT INTO users (username, password, fullname, email, tel) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, password, fullname, email, tel])
    client.release()

    return new User(
        result.rows[0].id,
        result.rows[0].username,
        result.rows[0].password,
        result.rows[0].fullname,
        result.rows[0].email,
        result.rows[0].tel
    )
}

// สร้างฟังก์ชันสำหรับการเข้าสู่ระบบ โดยสร้างฟังก์ชันชื่อ loginUser
export const loginUser = async (username: string): Promise<IUser | null> => {
    const client = await pool.connect()
    const result = await client.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      )
    client.release()

    if (result.rows.length > 0) {
        const { id, username, password, fullname, email, tel } = result.rows[0]
        return new User(id, username, password, fullname, email, tel)
    }

    return null
}