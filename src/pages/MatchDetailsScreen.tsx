import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RoundService from "../services/RoundService.tsx";
import { PlayerInterface, MatchInterface } from "../utils/interfaces.ts";
import PlayerService from "../services/PlayerService.tsx";

const MatchDetailsScreen = () => {
    const { roundId, matchId } = useParams();
    const [match, setMatch] = useState<MatchInterface | null>(null);
    const [players, setPlayers] = useState<PlayerInterface[]>([]);
    const [team1Points, setTeam1Points] = useState<number>(0); // Points for team1
    const [team2Points, setTeam2Points] = useState<number>(0); // Points for team2

    useEffect(() => {
        const fetchMatch = async () => {
            const rounds = await RoundService.getRounds();
            const round = rounds.find(r => r.id === roundId);
            const foundMatch = round?.matches.find(m => m.id === matchId);
            setMatch(foundMatch || null);
        };

        const fetchPlayers = async () => {
            const playerResponse = await PlayerService.getPlayers();
            setPlayers(playerResponse);
        };

        fetchMatch().then();
        fetchPlayers().then();
    }, [roundId, matchId]);

    const getPlayerName = (playerId: string): string => {
        const player = players.find(p => p.id === playerId);
        return player ? player.name : "Ukendt spiller";
    };

    const handlePointsChange = (team: "team1" | "team2", points: number) => {
        if (team === "team1") {
            setTeam1Points(points);
        } else {
            setTeam2Points(points);
        }
    };

    const handleSaveResult = async () => {
        if (match) {
            const updatedMatch = {
                ...match,
                team1: { ...match.team1, points: team1Points },
                team2: { ...match.team2, points: team2Points }
            };

            // Send the updated match data to backend
            await RoundService.updateMatchResult(roundId!, matchId!, updatedMatch);
            alert("Resultatet er gemt!");
        }
    };

    if (!match) {
        return <p>Loading match details...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-black">
            <h1 className="text-3xl font-semibold mb-4">Match Details</h1>
            <p className="text-lg font-medium mb-2">Dato: <span className="text-gray-600">{roundId}</span></p>
            <p className="text-lg font-medium mb-4">Match ID: <span className="text-gray-600">{matchId}</span></p>

            <p className="text-xl mb-6">
                {getPlayerName(match.team1.player1)} & {getPlayerName(match.team1.player2)} vs.{" "}
                {getPlayerName(match.team2.player1)} & {getPlayerName(match.team2.player2)}
            </p>

            <div className="space-y-4">
                <h2 className="text-2xl font-medium mb-2">Indtast resultat:</h2>

                <div className="flex items-center space-x-4">
                    <div className="flex flex-col w-1/2">
                        <label htmlFor="team1Points" className="text-lg font-medium mb-2">Team 1 Points:</label>
                        <input
                            id="team1Points"
                            type="number"
                            value={team1Points}
                            onChange={(e) => handlePointsChange("team1", parseInt(e.target.value))}
                            className="px-4 py-2 border border-gray-300 rounded-md text-lg"
                        />
                    </div>

                    <div className="flex flex-col w-1/2">
                        <label htmlFor="team2Points" className="text-lg font-medium mb-2">Team 2 Points:</label>
                        <input
                            id="team2Points"
                            type="number"
                            value={team2Points}
                            onChange={(e) => handlePointsChange("team2", parseInt(e.target.value))}
                            className="px-4 py-2 border border-gray-300 rounded-md text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSaveResult}
                    className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
                >
                    Gem Resultat
                </button>
            </div>

            <p className="text-lg mt-6">
                <span className="font-semibold">Points:</span> {team1Points} - {team2Points}
            </p>
        </div>
    );
};

export default MatchDetailsScreen;
