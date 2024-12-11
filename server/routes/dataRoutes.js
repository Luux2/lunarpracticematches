const express = require('express');
const router = express.Router();

const playerController = require('../controllers/playerController');
const roundController = require('../controllers/roundController');

// Player routes
router.get('/players', playerController.getPlayers);
router.post('/players', playerController.postPlayer);

//Round routes
router.get('/rounds', roundController.getRounds);
router.post('/rounds/:date', roundController.postRound);
router.put('/rounds/:roundId/matches/:matchId', roundController.updateMatchResult);

module.exports = router;
