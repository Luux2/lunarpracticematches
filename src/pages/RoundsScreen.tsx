import {PlayerInterface, RoundInterface} from "../utils/interfaces.ts";
import {useEffect, useState} from "react";
import RoundService from "../services/RoundService.tsx";
import PlayerService from "../services/PlayerService.tsx";
import {useNavigate} from "react-router-dom"; // Importér useNavigate

const RoundsScreen = () => {
    const [rounds, setRounds] = useState<RoundInterface[]>([]);
    const [players, setPlayers] = useState<PlayerInterface[]>([]); // Spillere til opslag
    const navigate = useNavigate(); // Til navigation

    useEffect(() => {
        const fetchRounds = async () => {
            const response = await RoundService.getRounds();
            setRounds(response);
        };

        const fetchPlayers = async () => {
            const playerResponse = await PlayerService.getPlayers();
            setPlayers(playerResponse);
        };

        fetchRounds().then();
        fetchPlayers().then();
    }, []);

    const getPlayerName = (id: string): string => {
        const player = players.find(p => p.id === id);
        return player ? player.name : "Ukendt spiller";
    };

    const handleMatchClick = (roundId: string, matchId: string) => {
        navigate(`/rounds/${roundId}/matches/${matchId}`);
    };

    return (
        <div>
            <h1 className="text-3xl">Runder</h1>
            <ul>
                {rounds.map((round) => (
                    <li key={round.id}>
                        <h2 className="mt-10">{round.id}</h2>
                        <ul>
                            {round.matches.map((match) => (
                                match.id && (
                                    <li
                                        className="mb-2 border-2 rounded-2xl p-2 cursor-pointer hover:bg-gray-200"
                                        key={match.id}
                                        onClick={() => handleMatchClick(round.id, match.id!)}
                                    >
                                        <p>
                                            {getPlayerName(match.team1.player1)} & {getPlayerName(match.team1.player2)} vs.{" "}
                                            {getPlayerName(match.team2.player1)} & {getPlayerName(match.team2.player2)}
                                        </p>
                                    </li>
                                )
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoundsScreen;
