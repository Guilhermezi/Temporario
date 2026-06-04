import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { Usuario } from "../models/Usuario"

// Singleton — evita múltiplas conexões em dev (hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
})

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export class UsuarioRepository {

  async salvar(usuario: Omit<Usuario, "id">): Promise<Usuario> {
    return await prisma.usuario.create({ data: usuario })
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { id } })
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { email } })
  }

  async listarTodos(): Promise<Usuario[]> {
    return await prisma.usuario.findMany()
  }

  async deletar(id: number): Promise<boolean> {
    try {
      await prisma.usuario.delete({ where: { id } })
      return true
    } catch {
      return false
    }
  }
}
