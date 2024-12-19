import { PlayerInterface, RoundInterface } from "../utils/interfaces.ts";
import { useEffect, useState } from "react";
import RoundService from "../services/RoundService.tsx";
import PlayerService from "../services/PlayerService.tsx";
import BackArrow from "../components/BackArrow.tsx";
import {ChevronRightIcon} from "@heroicons/react/24/outline";
import {format, isAfter, isToday, parse} from "date-fns";
import {da} from "date-fns/locale";

const RoundsScreen = () => {
    const [rounds, setRounds] = useState<RoundInterface[]>([]);
    const [players, setPlayers] = useState<PlayerInterface[]>([]);
    const [expandedRounds, setExpandedRounds] = useState<Set<string>>(new Set()); // Hold styr på hvilke runder der er åbne
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRounds = async () => {
            const response = await RoundService.getRounds();

            // Filtrer runder fra i dag eller frem
            const today = new Date();
            const filteredRounds = response.filter((round) =>
                isToday(parse(round.id, "dd-MM-yyyy", new Date())) ||
                isAfter(parse(round.id, "dd-MM-yyyy", new Date()), today)
            );

            // Sorter runder efter dato
            filteredRounds.sort((a, b) =>
                parse(a.id, "dd-MM-yyyy", new Date()).getTime() -
                parse(b.id, "dd-MM-yyyy", new Date()).getTime()
            );

            setRounds(filteredRounds);

            // Åbn den nyeste dato (første i listen)
            if (filteredRounds.length > 0) {
                setExpandedRounds(new Set([filteredRounds[0].id]));
            }
        };

        const fetchPlayers = async () => {
            const playerResponse = await PlayerService.getPlayers();
            setPlayers(playerResponse);
        };

        Promise.all([fetchRounds(), fetchPlayers()]).then(() => setIsLoading(false));
    }, []);

    const getPlayerName = (id: string): string => {
        const player = players.find((p) => p.id === id);
        return player ? player.name : "Ukendt spiller";
    };

    /*const handleMatchClick = (roundId: string, matchId: string) => {
        navigate(`/rounds/${roundId}/matches/${matchId}`);
    };*/

    const toggleRound = (roundId: string) => {
        setExpandedRounds((prev) => {
            const updated = new Set(prev);
            if (updated.has(roundId)) {
                updated.delete(roundId); // Luk runden
            } else {
                updated.add(roundId); // Åbn runden
            }
            return updated;
        });
    };

    if (isLoading) {
        return <p className="text-center mt-10">Indlæser runder...</p>;
    }

    return (
        <div>
            <BackArrow />
            <h1 className="text-3xl mt-10 text-center font-semibold">Dagens kampe</h1>
            <ul>
                {rounds.map((round) => (
                    <li key={round.id} className="border-b-2 pb-4 my-4" onClick={() => toggleRound(round.id)}>
                        <div className="flex justify-between">
                        <div className="ml-2 text-lg font-semibold cursor-pointer">
                            {format(parse(round.id, "dd-MM-yyyy", new Date()), "eeee, dd. MMMM", {locale: da})}
                        </div>
                            <ChevronRightIcon className={`h-6 mr-2 cursor-pointer transition-transform ${
                                expandedRounds.has(round.id) ? "rotate-90" : ""
                            }`}/>
                        </div>

                        {/* Vis kampene hvis runden er udvidet */}
                        {expandedRounds.has(round.id) && (
                            <ul className="mt-4 px-4 border-gray-300">
                                {round.matches.map(
                                    (match) =>
                                        match.id && (
                                            <li
                                                key={match.id}
                                                className="mb-4 p-2 cursor-pointer hover:bg-gray-700 border-2 rounded-xl"
                                            >
                                                <p
                                                    className={
                                                        match.winner === "team1"
                                                            ? "text-green-500 font-semibold"
                                                            : match.winner === "team2"
                                                                ? "text-red-500"
                                                                : ""
                                                    }
                                                >
                                                    {getPlayerName(match.team1.player1)} &{" "}
                                                    {getPlayerName(match.team1.player2)}
                                                </p>
                                                <p>vs</p>
                                                <p
                                                    className={
                                                        match.winner === "team2"
                                                            ? "text-green-500 font-semibold"
                                                            : match.winner === "team1"
                                                                ? "text-red-500"
                                                                : ""
                                                    }
                                                >
                                                    {getPlayerName(match.team2.player1)} &{" "}
                                                    {getPlayerName(match.team2.player2)}
                                                </p>
                                            </li>
                                        )
                                )}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoundsScreen;
