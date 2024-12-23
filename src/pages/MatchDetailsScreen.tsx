import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RoundService from "../services/RoundService.tsx";
import { PlayerInterface, MatchInterface } from "../utils/interfaces.ts";
import PlayerService from "../services/PlayerService.tsx";
import BackArrow from "../components/BackArrow.tsx";
import {ArrowsRightLeftIcon} from "@heroicons/react/24/outline";

const MatchDetailsScreen = () => {
    const { roundId, matchId } = useParams();
    const [match, setMatch] = useState<MatchInterface | null>(null);
    const [players, setPlayers] = useState<PlayerInterface[]>([]);
    const [team1SetPoints, setTeam1SetPoints] = useState<number[]>([]);
    const [team2SetPoints, setTeam2SetPoints] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            const rounds = await RoundService.getRounds();
            const round = rounds.find((r) => r.id === roundId);
            const foundMatch = round?.matches.find((m) => m.id === matchId);

            if (foundMatch) {
                const updatedMatch = {
                    ...foundMatch,
                    team1: {
                        ...foundMatch.team1,
                        left: foundMatch.team1.left || foundMatch.team1.player1, // Fallback til player1
                        right: foundMatch.team1.right || foundMatch.team1.player2, // Fallback til player2
                    },
                    team2: {
                        ...foundMatch.team2,
                        left: foundMatch.team2.left || foundMatch.team2.player1, // Fallback til player1
                        right: foundMatch.team2.right || foundMatch.team2.player2, // Fallback til player2
                    },
                };

                console.log("Fetched Match After Update:", updatedMatch); // Debug log
                setMatch(updatedMatch);

                const team1SetScores =
                    updatedMatch.team1.setScores || [
                        updatedMatch.team1.firstSetPoints || 0,
                        updatedMatch.team1.secondSetPoints || 0,
                        updatedMatch.team1.thirdSetPoints || 0,
                    ];

                const team2SetScores =
                    updatedMatch.team2.setScores || [
                        updatedMatch.team2.firstSetPoints || 0,
                        updatedMatch.team2.secondSetPoints || 0,
                        updatedMatch.team2.thirdSetPoints || 0,
                    ];

                setTeam1SetPoints(team1SetScores);
                setTeam2SetPoints(team2SetScores);
            } else {
                console.error("Match not found!");
            }
        };






        const fetchPlayers = async () => {
            const playerResponse = await PlayerService.getPlayers();
            setPlayers(playerResponse);
        };


        Promise.all([fetchMatch(), fetchPlayers()]).then(() => setIsLoading(false));
    }, [roundId, matchId]);



    const getPlayerName = (playerId: string): string => {
        const player = players.find(p => p.id === playerId);
        return player ? player.name : "Ukendt spiller";
    };

    const calculateSetWinners = (): ("team1" | "team2" | "draw")[] => {
        return team1SetPoints.map((points, index) => {
            if (points > team2SetPoints[index]) return "team1";
            if (points < team2SetPoints[index]) return "team2";
            return "draw";
        });
    };

    const calculateMatchWinner = (setWinners: ("team1" | "team2" | "draw")[]): "team1" | "team2" | "not finished" => {
        const team1SetsWon = setWinners.filter(winner => winner === "team1").length;
        const team2SetsWon = setWinners.filter(winner => winner === "team2").length;

        if (team1SetsWon > team2SetsWon) return "team1";
        if (team2SetsWon > team1SetsWon) return "team2";
        return "not finished";
    };

    const handlePointsChange = (team: "team1" | "team2", setIndex: number, points: number) => {
        if (team === "team1") {
            const updatedPoints = [...team1SetPoints];
            updatedPoints[setIndex] = points;
            setTeam1SetPoints(updatedPoints);
        } else {
            const updatedPoints = [...team2SetPoints];
            updatedPoints[setIndex] = points;
            setTeam2SetPoints(updatedPoints);
        }
    };

    const handleSaveResult = async () => {
        if (match) {
            const setWinners = calculateSetWinners();
            const winner = calculateMatchWinner(setWinners);

            const updatedMatch = {
                ...match,
                team1: {
                    ...match.team1,
                    setScores: team1SetPoints,
                    left: match.team1.left || match.team1.player1, // Inkluderer venstre position
                    right: match.team1.right || match.team1.player2, // Inkluderer højre position
                },
                team2: {
                    ...match.team2,
                    setScores: team2SetPoints,
                    left: match.team2.left || match.team2.player1, // Inkluderer venstre position
                    right: match.team2.right || match.team2.player2, // Inkluderer højre position
                },
                setWinners,
                winner,
            };

            try {
                // Opdater match-data i backend
                await RoundService.updateMatchResult(roundId!, matchId!, updatedMatch);
                alert("Resultatet er gemt!");
            } catch (error) {
                console.error("Error saving result:", error);
                alert("Der opstod en fejl under gemning af resultatet.");
            }
        }
    };


    if (isLoading || !match) {
        return <p className="text-center mt-10">Indlæser kamp...</p>;
    }

    return (
        <div className="max-w-3xl h-fit mx-auto p-6 bg-white rounded-lg shadow-md text-black">
            <BackArrow/>
            <h1 className="text-3xl font-semibold mb-4">Kampdetaljer</h1>

            <div className="text-xl mb-6">
                {/* Hold 1 */}
                <p className="text-center font-bold">Hold 1:</p>
                <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-center">
                        <label className="text-sm font-medium mb-1">Venstre</label>
                        <p className="text-center border rounded-md p-2 bg-gray-100">
                            {getPlayerName(match.team1.left || match.team1.player1)}
                        </p>
                    </div>


                    {/* Pilen til bytte */}
                    <div className="flex items-center justify-center">
                        <ArrowsRightLeftIcon
                            className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600"
                            onClick={() =>
                                setMatch((prevMatch) =>
                                    prevMatch
                                        ? {
                                            ...prevMatch,
                                            team1: {
                                                ...prevMatch.team1,
                                                left: prevMatch.team1.right,
                                                right: prevMatch.team1.left,
                                            },
                                        }
                                        : null
                                )
                            }
                        />
                    </div>

                    <div className="text-center">
                        <label className="text-sm font-medium mb-1">Højre</label>
                        <p className="text-center border rounded-md p-2 bg-gray-100">
                            {getPlayerName(match.team1.right || match.team1.player2)}
                        </p>
                    </div>
                </div>

                {/* Hold 2 */}
                <p className="text-center font-bold mt-8">Hold 2:</p>
                <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-center">
                        <label className="text-sm font-medium mb-1">Venstre</label>
                        <p className="text-center border rounded-md p-2 bg-gray-100">
                            {getPlayerName(match.team2.left || match.team2.player1)}
                        </p>
                    </div>

                    {/* Pilen til bytte */}
                    <div className="flex items-center justify-center">
                        <ArrowsRightLeftIcon
                            className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600"
                            onClick={() =>
                                setMatch((prevMatch) =>
                                    prevMatch
                                        ? {
                                            ...prevMatch,
                                            team2: {
                                                ...prevMatch.team2,
                                                left: prevMatch.team2.right,
                                                right: prevMatch.team2.left,
                                            },
                                        }
                                        : null
                                )
                            }
                        />
                    </div>

                    <div className="text-center">
                        <label className="text-sm font-medium mb-1">Højre</label>
                        <p className="text-center border rounded-md p-2 bg-gray-100">
                            {getPlayerName(match.team2.right || match.team2.player2)}
                        </p>
                    </div>
                </div>
            </div>


            {[0, 1, 2].map((setIndex) => (
                <div key={setIndex} className="space-y-4">
                    <h2 className="text-2xl font-medium my-2">Sæt {setIndex + 1}:</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col w-1/2">
                            <label className="text-lg font-medium mb-2">Hold 1:</label>
                            <input
                                type="number"
                                min={0}
                                value={team1SetPoints[setIndex] || 0}
                                onChange={(e) =>
                                    handlePointsChange("team1", setIndex, parseInt(e.target.value) || 0)
                                }
                                className="px-4 py-2 border border-gray-300 rounded-md text-lg"
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label className="text-lg font-medium mb-2">Hold 2:</label>
                            <input
                                type="number"
                                min={0}
                                value={team2SetPoints[setIndex] || 0}
                                onChange={(e) =>
                                    handlePointsChange("team2", setIndex, parseInt(e.target.value) || 0)
                                }
                                className="px-4 py-2 border border-gray-300 rounded-md text-lg"
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={handleSaveResult}
                className="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
            >
                Gem ændringer
            </button>
        </div>
    );
};

export default MatchDetailsScreen;
