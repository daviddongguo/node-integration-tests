import { HttpError } from './http.error'
import { Request, Response, NextFunction } from 'express'

export const errorResponser = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message })
  }
  res.status(500).json({ message: err.message })
}
