import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prisma } from "../db.server";

// Schema para verificar um produto
const verificarSchema = z.object({
  serialCode: z.string().min(1, "Código de série é obrigatório"),
  scanType: z.enum(["manual", "qr", "photo"]).default("manual"),
});

/**
 * Server Function: Verificar autenticidade de um produto
 */
export const verificarProduto = createServerFn({ method: "POST" })
  .inputValidator(verificarSchema)
  .handler(async ({ data }) => {
    try {
      const serialCode = data.serialCode.trim().toUpperCase();

      // Busca o produto no banco
      const product = await prisma.product.findUnique({
        where: { serialCode },
        include: { brand: true },
      });

      if (!product) {
        // Registra a verificação como NÃO ENCONTRADO
        await prisma.verification.create({
          data: {
            serialCode,
            status: "NOT_FOUND",
            scanType: data.scanType,
          },
        });

        return {
          status: "NOT_FOUND" as const,
          message: "Código não encontrado. Desconfie da procedência.",
          detail: null,
        };
      }

      // Verifica se o produto está dentro do prazo de validade
      const isExpired =
        product.expiryDate && new Date() > product.expiryDate;

      const status = isExpired ? "SUSPECT" : "ORIGINAL";

      // Registra a verificação
      await prisma.verification.create({
        data: {
          serialCode,
          status,
          scanType: data.scanType,
          productId: product.id,
        },
      });

      return {
        status,
        message: isExpired
          ? "Produto original, mas com prazo de validade expirado."
          : "Produto ORIGINAL verificado pela API byTrust.",
        detail: {
          brand: product.brand.name,
          productName: product.name,
          batch: product.batch,
          manufacturingDate: product.manufacturingDate?.toISOString() || null,
          expiryDate: product.expiryDate?.toISOString() || null,
          verifiedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Erro na verificação:", error);
      return {
        status: "ERROR" as const,
        message: "Erro interno ao verificar o produto. Tente novamente.",
        detail: null,
      };
    }
  });

/**
 * Server Function: Seed de produtos de demonstração
 * Apenas para desenvolvimento/teste
 */
export const seedProdutosDemo = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      // Verifica se já existem marcas
      const existingBrands = await prisma.brand.count();
      if (existingBrands > 0) {
        return {
          success: false as const,
          message: "Banco já possui dados. Seed ignorado.",
        };
      }

      // Cria marcas
      const brands = await Promise.all([
        prisma.brand.create({ data: { name: "Acme", slug: "acme" } }),
        prisma.brand.create({ data: { name: "TechBrand", slug: "techbrand" } }),
        prisma.brand.create({ data: { name: "LuxCosmetics", slug: "luxcosmetics" } }),
      ]);

      // Cria produtos
      await Promise.all([
        prisma.product.create({
          data: {
            serialCode: "123456",
            brandId: brands[0].id,
            name: "Smartphone X Pro",
            batch: "BATCH-2026-001",
            manufacturingDate: new Date("2026-01-15"),
          },
        }),
        prisma.product.create({
          data: {
            serialCode: "ABC-001",
            brandId: brands[1].id,
            name: "Fone Bluetooth Max",
            batch: "BT-2026-003",
            manufacturingDate: new Date("2026-02-20"),
          },
        }),
        prisma.product.create({
          data: {
            serialCode: "LUX-2026",
            brandId: brands[2].id,
            name: "Perfume Essence Gold",
            batch: "PG-2026-012",
            manufacturingDate: new Date("2026-03-01"),
            expiryDate: new Date("2028-03-01"),
          },
        }),
      ]);

      return {
        success: true as const,
        message: "Dados de demonstração criados com sucesso!",
        brandsCount: brands.length,
        productsCount: 3,
      };
    } catch (error) {
      console.error("Erro no seed:", error);
      return {
        success: false as const,
        message: "Erro ao criar dados de demonstração.",
      };
    }
  });