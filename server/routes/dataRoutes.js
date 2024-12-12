const express = require('express');
const router = express.Router();

const playerController = require('../controllers/playerController');
const roundController = require('../controllers/roundController');
const practiceController = require('../controllers/practiceController');

// Player routes
router.get('/players', playerController.getPlayers);
router.post('/players', playerController.postPlayer);

//Round routes
router.get('/rounds', roundController.getRounds);
router.post('/rounds/:date', roundController.postRound);
router.put('/rounds/:roundId/matches/:matchId', roundController.updateMatchResult);

//Practice routes
router.get('/practice-teams', practiceController.getPracticeTeams);
router.post('/practice-teams', practiceController.postPracticeTeam);

module.exports = router;
