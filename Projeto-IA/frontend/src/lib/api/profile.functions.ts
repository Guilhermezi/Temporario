import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "../db.server";
import { verifyToken } from "../auth.server";

/**
 * Schema base para validação (reutilizado em todas as funções)
 */
const tokenSchema = z.object({ token: z.string() });

/**
 * Busca os dados do usuário logado.
 * O token JWT é enviado pelo cliente (salvo no localStorage).
 */
export const getUsuarioLogado = createServerFn({ method: "GET" })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    try {
      const decoded = verifyToken(data.token);
      if (!decoded) {
        return { success: false as const, error: "Token inválido" };
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          company: true,
          plan: true,
          createdAt: true,
          _count: {
            select: {
              verifications: true,
            },
          },
        },
      });

      if (!user) {
        return { success: false as const, error: "Usuário não encontrado" };
      }

      return {
        success: true as const,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          company: user.company,
          plan: user.plan,
          createdAt: user.createdAt.toISOString(),
          totalVerifications: user._count.verifications,
        },
      };
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return { success: false as const, error: "Erro interno" };
    }
  });

/**
 * Atualiza dados do perfil do usuário
 */
export const atualizarPerfil = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
      name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").optional(),
      company: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const decoded = verifyToken(data.token);
      if (!decoded) {
        return { success: false as const, error: "Token inválido" };
      }

      const user = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          ...(data.name && { name: data.name.trim() }),
          ...(data.company !== undefined && {
            company: data.company.trim() || null,
          }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          company: true,
          plan: true,
          createdAt: true,
        },
      });

      return {
        success: true as const,
        message: "Perfil atualizado com sucesso!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          company: user.company,
          plan: user.plan,
          createdAt: user.createdAt.toISOString(),
        },
      };
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return { success: false as const, error: "Erro ao atualizar perfil." };
    }
  });