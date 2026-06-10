import { Router, Response, NextFunction } from "express";
import { prisma } from "../models/prisma";
import { AuthenticatedRequest } from "../middleware/auth";

export const badgeRouter = Router();

// GET /api/badges — insígnias do usuário logado
badgeRouter.get(
  "/",
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userBadges = await prisma.userBadge.findMany({
        where: { userId: req.userId },
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      });
      res.json(userBadges);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/badges/all — catálogo completo de insígnias
badgeRouter.get(
  "/all",
  async (_req, res: Response, next: NextFunction) => {
    try {
      const badges = await prisma.badge.findMany({ orderBy: { name: "asc" } });
      res.json(badges);
    } catch (err) {
      next(err);
    }
  }
);
