import { Response, Request, NextFunction } from 'express'
import { AuthService } from '../../infrastructure/services/AuthService' 
import { HttpStatus } from '../../utils/HttpStatus'
import { createResponse } from '../../utils/CustomResponse'

const authService = new AuthService()

interface customRequest extends Request {
    user?: any
}

export const verifyAccessToken = async ( req: customRequest, res: Response, next: NextFunction): Promise<void> =>  {
    try {

        console.log(req.cookies)
        const token = req.cookies.accessToken

        if(!token){
            res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'Access token is missing', null))
            return
        }

        const decoded = await authService.verifyAccessToken(token)

        console.log(decoded)

        req.user  = decoded.email

        next();

    } catch (error: any) {
        res.status(HttpStatus.UNAUTHORIZED).json(createResponse('error', 'Invalid or expired access token', null))
        return
    }
} 