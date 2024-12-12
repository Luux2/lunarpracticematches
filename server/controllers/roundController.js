const db = require('../config/firebase');

// Hent alle runder
const getRounds = async (req, res) => {
    try {
        const ref = db.ref('/rounds');
        await ref.once('value', (snapshot) => {
            const data = snapshot.val();

            const roundsArray = data
                ? Object.keys(data).map(key => ({
                    id: key,
                    matches: Object.keys(data[key]).map(matchKey => ({
                        id: matchKey,
                        team1: {
                            player1: data[key][matchKey].team1.player1,
                            player2: data[key][matchKey].team1.player2,
                            firstSetPoints: data[key][matchKey].team1.firstSetPoints || 0,
                            secondSetPoints: data[key][matchKey].team1.secondSetPoints || 0,
                            thirdSetPoints: data[key][matchKey].team1.thirdSetPoints || 0,
                            left: data[key][matchKey].team1.left, // Behold værdien fra databasen
                            right: data[key][matchKey].team1.right, // Behold værdien fra databasen
                        },
                        team2: {
                            player1: data[key][matchKey].team2.player1,
                            player2: data[key][matchKey].team2.player2,
                            firstSetPoints: data[key][matchKey].team2.firstSetPoints || 0,
                            secondSetPoints: data[key][matchKey].team2.secondSetPoints || 0,
                            thirdSetPoints: data[key][matchKey].team2.thirdSetPoints || 0,
                            left: data[key][matchKey].team2.left, // Behold værdien fra databasen
                            right: data[key][matchKey].team2.right, // Behold værdien fra databasen
                        },
                        winner: data[key][matchKey].winner || "not finished",
                    })),
                }))
                : [];

            console.log("Sending Data to Frontend:", roundsArray); // Debug log
            res.json(roundsArray);
        });
    } catch (error) {
        console.error("Error fetching rounds:", error);
        res.status(500).json({ message: "Failed to fetch rounds" });
    }
};




// Gem en ny runde
const postRound = async (req, res) => {
    const { matches } = req.body;
    const { date } = req.params;

    if (!date || !matches || matches.length !== 12) {
        return res.status(400).json({ message: "Invalid input data. Ensure 6 matches are provided." });
    }

    try {
        const roundRef = db.ref(`/rounds/${date}`);

        const formattedMatches = matches.map(match => ({
            team1: {
                player1: match.team1.player1,
                player2: match.team1.player2,
                firstSetPoints: 0,
                secondSetPoints: 0,
                thirdSetPoints: 0,
            },
            team2: {
                player1: match.team2.player1,
                player2: match.team2.player2,
                firstSetPoints: 0,
                secondSetPoints: 0,
                thirdSetPoints: 0,
            },
            winner: "not finished",
        }));

        const promises = formattedMatches.map(match => roundRef.push(match));
        await Promise.all(promises);

        res.json({ message: "Round added" });
    } catch (error) {
        console.error("Error saving round:", error);
        res.status(500).json({ message: "Failed to save round" });
    }
};


const updateMatchResult = async (req, res) => {
    const { roundId, matchId } = req.params;
    const { team1, team2, winner } = req.body;

    try {
        const matchRef = db.ref(`/rounds/${roundId}/${matchId}`);
        await matchRef.update({
            team1: {
                player1: team1.player1,
                player2: team1.player2,
                firstSetPoints: team1.firstSetPoints,
                secondSetPoints: team1.secondSetPoints,
                thirdSetPoints: team1.thirdSetPoints,
                left: team1.left,
                right: team1.right,
            },
            team2: {
                player1: team2.player1,
                player2: team2.player2,
                firstSetPoints: team2.firstSetPoints,
                secondSetPoints: team2.secondSetPoints,
                thirdSetPoints: team2.thirdSetPoints,
                left: team2.left,
                right: team2.right,
            },
            winner: winner || "not finished",
        });

        res.json({ message: "Match result updated successfully" });
    } catch (error) {
        console.error("Error updating match result:", error);
        res.status(500).json({ message: "Failed to update match result" });
    }
};



module.exports = { getRounds, postRound, updateMatchResult };
