import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "../db.server";
import {
  hashPassword,
  comparePassword,
  generateToken,
  createAuthCookie,
} from "../auth.server";
import { validarEmail, validarSenha } from "../validation";

const cadastroSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  profile: z.enum(["consumidor", "varejista", "marca"]),
  company: z.string().optional(),
  plan: z.enum(["gratuito", "profissional", "enterprise"]),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const cadastrarUsuario = createServerFn({ method: "POST" })
  .inputValidator(cadastroSchema)
  .handler(async ({ data }) => {
    try {
      const emailResult = validarEmail(data.email);
      if (!emailResult.valido) {
        return {
          success: false as const,
          error: emailResult.mensagem,
        };
      }

      const senhaResult = validarSenha(data.password);
      if (!senhaResult.valido) {
        return {
          success: false as const,
          error: senhaResult.mensagem,
        };
      }

      const email = data.email.toLowerCase().trim();

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          success: false as const,
          error: "Este e-mail já está cadastrado. Faça login ou utilize outro e-mail.",
        };
      }

      const hashedPassword = await hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          name: data.name.trim(),
          email,
          password: hashedPassword,
          profile: data.profile,
          company: data.company?.trim() || null,
          plan: data.plan,
        },
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      return {
        success: true as const,
        token,
        cookie: createAuthCookie(token),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          plan: user.plan,
          company: user.company,
        },
      };
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return {
        success: false as const,
        error: "Ocorreu um erro interno. Tente novamente mais tarde.",
      };
    }
  });

export const loginUsuario = createServerFn({ method: "POST" })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    try {
      const emailResult = validarEmail(data.email);
      if (!emailResult.valido) {
        return {
          success: false as const,
          error: emailResult.mensagem,
        };
      }

      const email = data.email.toLowerCase().trim();

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false as const,
          error: "E-mail ou senha incorretos.",
        };
      }

      const senhaValida = await comparePassword(data.password, user.password);

      if (!senhaValida) {
        return {
          success: false as const,
          error: "E-mail ou senha incorretos.",
        };
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      return {
        success: true as const,
        token,
        cookie: createAuthCookie(token),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile: user.profile,
          plan: user.plan,
          company: user.company,
          createdAt: user.createdAt?.toISOString?.() ?? null,
        },
      };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false as const,
        error: "Ocorreu um erro interno. Tente novamente mais tarde.",
      };
    }
  });