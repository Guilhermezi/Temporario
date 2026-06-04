import { Router, Request, Response } from "express"
import { AuthService } from "../services/AuthService"
import { UsuarioRepository } from "../repositories/UsuarioRepository"
import { autenticar } from "../middlewares/auth.middleware"

const router = Router()
const authService = new AuthService()
const repository = new UsuarioRepository()

// POST /auth/registrar
// Body: { nome, email, senha }
// Response 201: { id, nome, email, role }
router.post("/registrar", async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body
    const usuario = await authService.registrar(nome, email, senha)
    const { senha: _, ...usuarioSemSenha } = usuario
    res.status(201).json(usuarioSemSenha)
  } catch (error) {
    if (error instanceof Error) res.status(400).json({ error: error.message })
  }
})

// POST /auth/login
// Body: { email, senha }
// Response 200: { token }
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body
    const token = await authService.login(email, senha)
    res.status(200).json({ token })
  } catch (error) {
    if (error instanceof Error) res.status(401).json({ error: error.message })
  }
})

// GET /auth/me  — requer Authorization: Bearer <token>
// Response 200: { id, nome, email, role }
router.get("/me", autenticar, async (req: Request, res: Response) => {
  try {
    const usuario = await repository.buscarPorId(req.usuario!.id)
    if (!usuario) {
      res.status(404).json({ error: "Usuário não encontrado" })
      return
    }
    const { senha: _, ...usuarioSemSenha } = usuario
    res.json(usuarioSemSenha)
  } catch {
    res.status(500).json({ error: "Erro interno" })
  }
})

export default router
