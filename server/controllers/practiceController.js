const db = require('../config/firebase'); // Sørg for, at din Firebase-konfiguration er korrekt importeret

const getPracticeTeams = async (req, res) => {
    try {
        // Reference til "practice-teams" i databasen
        const practiceTeamsRef = db.ref('/practice-teams');

        // Hent data fra databasen
        const snapshot = await practiceTeamsRef.once('value');
        const practiceTeams = snapshot.val();

        res.status(200).json(practiceTeams);
    } catch (error) {
        console.error("Error fetching practice teams:", error);
        res.status(500).json({ message: "Failed to fetch practice teams" });
    }
}

const postPracticeTeam = async (req, res) => {
    const { startTime, endTime, players } = req.body;

    // Valider input
    if (!startTime || !endTime || !players || players.length !== 4) {
        return res.status(400).json({ message: "Invalid input. Ensure startTime, endTime, and exactly 4 players are provided." });
    }

    try {
        // Reference til "practice-teams" i databasen
        const practiceTeamsRef = db.ref('/practice-teams');

        // Push en ny træning ind i databasen
        const newPracticeTeamRef = practiceTeamsRef.push();
        await newPracticeTeamRef.set({
            startTime,
            endTime,
            players,
        });

        res.status(201).json({
            message: "Practice team created successfully",
            id: newPracticeTeamRef.key, // Returner det genererede ID
        });
    } catch (error) {
        console.error("Error creating practice team:", error);
        res.status(500).json({ message: "Failed to create practice team" });
    }
};

module.exports = {getPracticeTeams, postPracticeTeam };
