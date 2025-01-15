import { Request, Response, NextFunction } from 'express'
import * as jwtUtils from '../utils/jwtUtils'

interface AuthRequest extends Request {
    user?: { userId: number }
}

const authenticateJWT = (
    req: AuthRequest, 
    res: Response, 
    next: NextFunction) => {
    
    // ดึงค่า token จาก header
    const authHeader = req.header('Authorization')
    // ถ้ามี token ให้แยก Bearer ออกจาก token และเก็บไว้ที่ตัวแปร token โดยฟังก์ชัน split จะแยกข้อความออกเมื่อพบช่องว่าง
    const token = authHeader && authHeader.split(' ')[1]
    
    // ถ้าไม่มี token ให้ส่ง status 401 กลับไป และแจ้งว่า Unauthorized
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' })
        return // ถ้าไม่มี token ให้หยุดการทำงานที่นี่
    }

    // ถ้ามี token ให้ตรวจสอบ token ว่าถูกต้องหรือไม่
    try {
        // ถ้า token ถูกต้องให้แปลง token ให้เป็นข้อมูล user และเก็บไว้ที่ตัวแปร user
        const user = jwtUtils.verifyAccessToken(token)
        req.user = user as { userId: number } // ถ้า token ถูกต้องให้เก็บข้อมูล user ไว้ที่ req.user
        next() // ถ้า token ถูกต้องให้ไปทำงานต่อ
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token' })
    }

}

export default authenticateJWT