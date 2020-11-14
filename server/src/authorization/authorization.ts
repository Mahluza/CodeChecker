import IUserModel from '../models/IUserModel'
import Director from '../models/Director'

const jwt = require('jsonwebtoken')

export const ACCESS_TOKEN_SECRET = 'aNhztLmF5F5RhHTxI9EJ6jodwefMq19m'

export function authorize(req: any, res: any, next: any): void {
  if (
    req.url != '/users' &&
    req.url != '/users/validate' &&
    req.url != '/detection/create'
  ) {
    const authHeader = req.headers.authorization
    if (authHeader) {
      jwt.verify(
        authHeader,
        ACCESS_TOKEN_SECRET,
        (err: any, userDetails: any) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              return res.status(401).send({ message: 'Session Expired' })
            } else {
              return res.sendStatus(403)
            }
          }
          let user = Director.getUserModel(userDetails.email)
          if (user) {
            req.body.user = user
            next()
          } else {
            res.sendStatus(401)
          }
        }
      )
    } else {
      res.sendStatus(401)
    }
  } else {
    next()
  }
}

export function generateToken(user: IUserModel): string {
  return jwt.sign({ email: user.getEmail(), role: 1 }, ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  })
}
