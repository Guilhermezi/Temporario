import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UsuarioRepository } from "../repositories/UsuarioRepository"

const SECRET = process.env.JWT_SECRET
const repository = new UsuarioRepository()

export class AuthService {

  async registrar(nome: string, email: string, senha: string) {
    if (!nome?.trim()) throw new Error("Nome é obrigatório")

    const emailExiste = await repository.buscarPorEmail(email)
    if (emailExiste) throw new Error("Email já cadastrado")

    if (email.length < 5 || !email.includes("@")) throw new Error("Email inválido")

    if (senha.length < 6 || !/\d/.test(senha) || !/[a-zA-Z]/.test(senha)) {
      throw new Error("Senha fraca. Mínimo 6 caracteres com letras e números.")
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)
    return await repository.salvar({ nome, email, senha: senhaCriptografada, role: "USER" })
  }

  async login(email: string, senha: string): Promise<string> {
    const usuario = await repository.buscarPorEmail(email)
    if (!usuario) throw new Error("Email ou senha incorretos")

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) throw new Error("Email ou senha incorretos")

    if (!SECRET) throw new Error("JWT_SECRET não definido")

    return jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      SECRET,
      { expiresIn: "7d" }
    )
  }
}
