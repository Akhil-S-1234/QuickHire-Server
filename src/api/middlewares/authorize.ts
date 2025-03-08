import { Response, Request, NextFunction,RequestHandler } from 'express'
import { AuthService } from '../../infrastructure/services/AuthService' 
import { HttpStatus } from '../../utils/HttpStatus'
import { createResponse } from '../../utils/CustomResponse'

const authService = new AuthService()

interface CustomRequest extends Request {
    user?: any
    
}
export const authorize = (role: string): RequestHandler => {
    return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                res.status(HttpStatus.UNAUTHORIZED).json(
                    createResponse('error', 'Authentication required', null)
                )
                return
            }

            if (role !== req.user.role) {
                res.status(HttpStatus.FORBIDDEN).json(
                    createResponse('error', 'Access denied', 'Unauthorized role access.')
                )
                return

                
            }

            req.user = req.user.email

            next()
        } catch (error) {
            next(error)
        }
    }
}