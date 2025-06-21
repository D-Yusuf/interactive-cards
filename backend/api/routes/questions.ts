import { Router } from "oak/router";
import { createQuestion, getQuestions, getQuestion, updateQuestion, deleteQuestion, trackAnsweredQuestion, resetQuestionsForGame, resetAllQuestions } from "../controllers/questionController.ts";

const router = new Router();

router
  .post("/questions", createQuestion)
  .get("/questions", getQuestions)
  .get("/questions/:id", getQuestion)
  .put("/questions/:id", updateQuestion)
  .delete("/questions/:id", deleteQuestion)
  .post("/questions/:id/answer", trackAnsweredQuestion)
  .post("/questions/reset-game/:gameId", resetQuestionsForGame)
  .post("/questions/reset-all", resetAllQuestions);

export default router; 