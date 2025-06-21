import { Router } from "oak/router";
import { createGame, updateGame, getGame, getGames, endGame, deleteGame } from "../controllers/game.ts";

const router = new Router();

router.get('/games', getGames);
router.post('/games', createGame);
router.put('/games/:id', updateGame);
router.get('/games/:id', getGame);
router.post('/games/:id/end', endGame);
router.delete('/games/:id', deleteGame);

export default router;