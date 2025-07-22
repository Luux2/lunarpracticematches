const express = require('express');
const router = express.Router();

const playerController = require('../controllers/playerController');
const roundController = require('../controllers/roundController');
const practiceController = require('../controllers/practiceController');
const teamController = require('../controllers/teamController');

// Player routes
router.get('/players', playerController.getPlayers);
router.post('/players', playerController.postPlayer);

//Round routes
router.get('/rounds', roundController.getRounds);
router.post('/rounds/:date', roundController.postRound);
router.patch('/rounds/:roundId/:matchId', roundController.updateMatchTeams);

//Practice routes
router.get('/practice-teams', practiceController.getPracticeTeams);
router.post('/practice-teams', practiceController.postPracticeTeam);
router.patch('/practice-teams/:teamId', practiceController.patchPlayer);

//Team routes
router.get('/teams', teamController.getTeams);
router.post('/teams', teamController.postTeam);
router.delete('/teams/:teamId', teamController.deleteTeam);

module.exports = router;