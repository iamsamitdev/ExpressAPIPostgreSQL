import { Request , Response } from 'express'
import bcrypt from 'bcryptjs'
import * as userService from '../services/userService'
import * as jwtUtils from '../utils/jwtUtils'

// ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ใหม่
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    // ดึงข้อมูลจาก body
    const { username, password, fullname, email, tel } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10) // ทำการเข้ารหัสรหัสผ่าน
        const user = await userService.registerUser(username, hashedPassword, fullname, email, tel)
        res.status(201).json(user)
    } catch (error) {
        const err = error as Error
        res.status(500).json({ message: 'Error registering user', error: err.message })
    }
}

// ฟังก์ชันสำหรับเข้าสู่ระบบ
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    // ดึงข้อมูลจาก body
    const { username, password } = req.body

    try {
        // ค้นหาผู้ใช้จาก username
        const user = await userService.loginUser(username)
        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' })
            return
        }

        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid username or password' })
            return
        }

        // สร้าง Access Token และ Refresh Token
        const accessToken = jwtUtils.generateAccessToken(user.id)
        const refreshToken = jwtUtils.generateRefreshToken(user.id)

        res.status(200).json({ 
            user: {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                tel: user.tel,
            },
            accessToken, 
            refreshToken 
        })
    } catch (error) {
        const err = error as Error
        res.status(500).json({ message: 'Error logging in', error: err.message })
    }
}

// ฟังก์ชัน refresh token
export const refreshToken = async (
    req: Request & { body: { refreshToken: string } }, 
    res: Response): Promise<void> => {

    // ดึง refresh token จาก body
    const { refreshToken } = req.body

    // ตรวจสอบว่ามี refresh token หรือไม่
    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is required' })
        return
    }

    // ตรวจสอบความถูกต้องของ refresh token
    if (!jwtUtils.isRefreshTokenValid(refreshToken)) {
        res.status(403).json({ message: 'Invalid refresh token' })
        return
    }

    try {
        const decoded = jwtUtils.verifyRefreshToken(refreshToken)
        const userId = decoded?.userId
        if (!userId) {
            res.status(403).json({ message: 'Invalid refresh token' })
            return
        }
        const newAccessToken = jwtUtils.generateAccessToken(userId)
        res.status(200).json({ accessToken: newAccessToken })
    } catch (error) {
        const err = error as Error
        res.status(500).json({ message: 'Error refreshing token', error: err.message })
    }
}

// ฟังก์ชันสำหรับการออกจากระบบ
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    
    const { refreshToken } = req.body

    if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token is required' })
        return
    }

    jwtUtils.revokeRefreshToken(refreshToken)
    res.json({ message: 'User logged out successfully' })
}