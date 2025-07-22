const db = require('../config/firebase');

const getTeams = async (req, res) => {
    const ref = db.ref('/teams');
    await ref.once('value', (snapshot) => {
        const data = snapshot.val();

        const teamsArray = data ? Object.keys(data).map(key => ({id: key, ...data[key]})) : [];

        res.json(teamsArray);
    });
}

const postTeam = async (req, res) => {
    const ref = db.ref('/teams');
    await ref.push(req.body);
    res.json({message: 'Team added'});
}

const deleteTeam = async (req, res) => {
    const teamId = req.params.teamId;
    const ref = db.ref(`/teams/${teamId}`);
    await ref.remove();
    res.json({message: 'Team deleted'});
}

module.exports = {getTeams, postTeam, deleteTeam};