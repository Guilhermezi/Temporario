import { Request, Response, NextFunction } from "express"

export function apenasAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.usuario) {
    res.status(401).json({ error: "Não autenticado" })
    return
  }
  if (req.usuario.role !== "ADMIN") {
    res.status(403).json({ error: "Acesso negado: apenas administradores" })
    return
  }
  next()
}
