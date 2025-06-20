import { Router } from "oak/router";
import { createCategory, getCategories, getCategory, deleteCategory } from "../controllers/categories.ts";

const router = new Router();

router
  .post("/categories", createCategory)
  .get("/categories", getCategories)
  .get("/categories/:id", getCategory)
  .delete("/categories/:id", deleteCategory);

export default router; 