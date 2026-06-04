import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface JwtPayload {
  id: number
  email: string
  role: string
}

// Extende o tipo Request para carregar o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      usuario?: JwtPayload
    }
  }
}

const SECRET = process.env.JWT_SECRET

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization
  if (!authorization) {
    res.status(401).json({ error: "Token não fornecido" })
    return
  }

  const token = authorization.split(" ")[1]

  try {
    if (!SECRET) throw new Error("JWT_SECRET não definido")
    const payload = jwt.verify(token, SECRET) as JwtPayload
    req.usuario = payload
    next()
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" })
  }
}
