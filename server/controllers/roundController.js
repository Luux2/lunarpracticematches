const db = require('../config/firebase');

// Hent alle runder
const getRounds = async (req, res) => {
    try {
        const ref = db.ref('/rounds');
        await ref.once('value', (snapshot) => {
            const data = snapshot.val();

            // Konverter Firebase-objektet til en array og tilføj match.id
            const roundsArray = data
                ? Object.keys(data).map(key => ({
                    id: key, // Runden ID (dato)
                    matches: Object.keys(data[key]).map(matchKey => ({
                        id: matchKey, // Kampens unikke ID fra Firebase-nøglen
                        ...data[key][matchKey], // Resten af kampdataen
                    })),
                }))
                : [];

            res.json(roundsArray); // Send det formaterede array af runder til frontend
        });
    } catch (error) {
        console.error("Error fetching rounds:", error);
        res.status(500).json({ message: "Failed to fetch rounds" });
    }
};


// Gem en ny runde
const postRound = async (req, res) => {
    const { matches } = req.body; // Kampene
    const { date } = req.params; // Dato fra URL

    if (!date || !matches || matches.length !== 6) {
        return res.status(400).json({ message: "Invalid input data. Ensure 6 matches are provided." });
    }

    try {
        const roundRef = db.ref(`/rounds/${date}`);

        // Tilføj hver kamp som et nyt barn under rundens dato
        const promises = matches.map(match => roundRef.push(match));
        await Promise.all(promises);

        res.json({ message: "Round added" });
    } catch (error) {
        console.error("Error saving round:", error);
        res.status(500).json({ message: "Failed to save round" });
    }
};

const updateMatchResult = async (req, res) => {
    const { roundId, matchId } = req.params; // Hent roundId og matchId fra URL
    const { team1, team2 } = req.body; // Hent de opdaterede teamdata fra request body

    try {
        const matchRef = db.ref(`/rounds/${roundId}/${matchId}`);
        await matchRef.update({
            team1: {
                player1: team1.player1,
                player2: team1.player2,
                points: team1.points,
            },
            team2: {
                player1: team2.player1,
                player2: team2.player2,
                points: team2.points,
            }
        });

        res.json({ message: "Match result updated successfully" });
    } catch (error) {
        console.error("Error updating match result:", error);
        res.status(500).json({ message: "Failed to update match result" });
    }
};


module.exports = { getRounds, postRound, updateMatchResult };
