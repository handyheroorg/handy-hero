declare namespace Express {
  export interface Request {
    user: import('../users/users.types').SanitizedUser
  }
}
