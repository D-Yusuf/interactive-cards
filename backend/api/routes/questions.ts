import { Router } from "oak/router";
import { createQuestion, getQuestions, getQuestion, updateQuestion, deleteQuestion } from "../controllers/questionController.ts";

const router = new Router();

router
  .post("/questions", createQuestion)
  .get("/questions", getQuestions)
  .get("/questions/:id", getQuestion)
  .put("/questions/:id", updateQuestion)
  .delete("/questions/:id", deleteQuestion);

export default router; 