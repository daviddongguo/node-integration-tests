import { Request, Response, NextFunction } from 'express'

export const errorResponser = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  res.status(500).json({ error: err.message })
}
