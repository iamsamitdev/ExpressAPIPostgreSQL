import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET as string
const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRY as string
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET as string
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY as string

let refreshTokens: string[] = []

interface TokenPayload {
    userId: number
    id?: number
}

// Generate Access Token
export const generateAccessToken = (userId: number): string => {
    return jwt.sign(
        { userId }, 
        ACCESS_TOKEN_SECRET, 
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    )
}

// Generate Refresh Token
export const generateRefreshToken = (userId: number): string => {
    const refreshToken = jwt.sign(
        { userId }, 
        REFRESH_TOKEN_SECRET, 
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    )
    refreshTokens.push(refreshToken)
    return refreshToken
}

// Verify Access Token
export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload
    } catch (error) {
        return null
    }
}

// Verify Refresh Token
export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload
    } catch (error) {
        return null
    }
}

// Revoke Refresh Token
export const revokeRefreshToken = (token: string): void => {
    refreshTokens = refreshTokens.filter((t) => t !== token)
}

// Is Refresh Token Valid
export const isRefreshTokenValid = (token: string): boolean => {
    return refreshTokens.includes(token)
} 