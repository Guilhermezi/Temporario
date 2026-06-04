import "dotenv/config";
import cors from "cors";
import express, { Request, Response, Router } from "express";
import authRouter from "./routes/auth.routes";
import { apenasAdmin } from "./middlewares/admin.middleware";
import { autenticar } from "./middlewares/auth.middleware";
import { UsuarioService } from "./services/UsuarioServices";

const usuarioService = new UsuarioService();
const app = express();
const router = Router();
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use("/auth", authRouter);

router.get("/", autenticar, apenasAdmin, async (_req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.listar();
    res.json(usuarios);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.get("/:id", autenticar, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const usuario = await usuarioService.buscar(id);
    res.json(usuario);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    }
  }
});

router.delete("/:id", autenticar, apenasAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await usuarioService.deletar(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
    }
  }
});

app.use("/usuarios", router);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});