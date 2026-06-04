import { UsuarioRepository } from "../repositories/UsuarioRepository"
import { Usuario } from "../models/Usuario"

export class UsuarioService {
    private repository = new UsuarioRepository()

    async cadastrar(nome: string, email: string, senha: string): Promise<Usuario> {
        const emailExiste = await this.repository.buscarPorEmail(email)
        if (emailExiste) {
            throw new Error("Email já cadastrado")
        }

        return await this.repository.salvar({ nome, email, senha, role: "USER" })
    }

    async buscar(id: number): Promise<Omit<Usuario, "senha">> {
        const usuario = await this.repository.buscarPorId(id)
        if (!usuario) {
            throw new Error("Usuário não encontrado")
        }

        const { senha, ...usuarioSemSenha } = usuario
        return usuarioSemSenha
    }

    async listar(): Promise<Omit<Usuario, "senha">[]> {
        const usuarios = await this.repository.listarTodos()
        return usuarios.map(({ senha, ...resto }) => resto)
    }

    async deletar(id: number): Promise<void> {
        const deletado = await this.repository.deletar(id)
        if (!deletado) {
            throw new Error("Usuário não encontrado")
        }
    }
}