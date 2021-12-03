import { Request, Response, NextFunction } from 'express'

export const inValidPathHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errMsg = `not found ${req.url}`
  next(new Error(errMsg))
}
