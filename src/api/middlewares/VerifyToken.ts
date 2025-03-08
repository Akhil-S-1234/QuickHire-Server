import { Response, Request, NextFunction } from 'express'
import { AuthService } from '../../infrastructure/services/AuthService' 
import { HttpStatus } from '../../utils/HttpStatus'
import { createResponse } from '../../utils/CustomResponse'

const authService = new AuthService()

interface CustomRequest extends Request {
    user?: any
    
}

export const verifyAccessToken = (role: string) => {
    return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Log incoming cookies for debugging
            console.log('Incoming Cookies:', req.cookies)
            
            const accessTokenKey = `${role}AccessToken`
            const refreshTokenKey = `${role}RefreshToken`
            const accessToken = req.cookies[accessTokenKey]
            const refreshToken = req.cookies[refreshTokenKey]

            // Check if access token is missing
            if (!accessToken) {
                // If no access token, attempt to refresh
                if (refreshToken) {
                    await handleTokenRefresh(req, res, refreshToken, accessTokenKey)
                    return
                }
                
                // No refresh token available
                res.status(HttpStatus.UNAUTHORIZED).json(
                    createResponse('error', 'Authentication required', null)
                )
                return
            }

            // Verify access token
            const decoded = await authService.verifyAccessToken(accessToken)
            
            // Log decoded token for debugging
            console.log('Decoded Token:', decoded)

            // Attach user to request
            req.user = decoded

            next()

        } catch (error: any) {
            // No refresh token or refresh failed
            res.status(HttpStatus.UNAUTHORIZED).json(
                createResponse('error', 'Authentication required', null)
            )
            return
        }
    }
}

// Handle token refresh
const handleTokenRefresh = async (req: CustomRequest, res: Response, refreshToken: string, accessTokenKey: string): Promise<void> => {
    try {
        // Attempt to refresh tokens
        const accessToken = await authService.refreshAccessToken(refreshToken)

        // Set new tokens in HTTP-only cookies
        res.cookie(accessTokenKey, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 
        })

        // Prepare response for client to retry original request
        res.status(HttpStatus.UNAUTHORIZED).json(
            createResponse('token_refresh', 'Token refreshed', {
                retry: true
            })
        )
    } catch (refreshError) {
        // Refresh token is invalid or expired
        res.status(HttpStatus.UNAUTHORIZED).json(
            createResponse('error', 'Authentication required', null)
        )
    }
}