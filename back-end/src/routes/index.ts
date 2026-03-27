import { Router } from "express";
import lideresRoutes from "./lideres.routes";
import materiaisRoutes from "./materiais.routes";

const router = Router();

router.use("/lideres", lideresRoutes);
router.use("/materiais", materiaisRoutes);

export default router;
