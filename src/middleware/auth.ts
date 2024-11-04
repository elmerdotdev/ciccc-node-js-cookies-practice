import { Request, Response, NextFunction } from 'express'

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authToken } = req.signedCookies
  console.log(authToken)
  if (authToken === "authenticated") {
    next()
  } else {
    res.redirect('/login')
  }
}