import { useEffect, useState } from "react";
import {Button, Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import {MatchInterface, PlayerInterface} from "../utils/interfaces.ts";
import PlayerService from "../services/PlayerService.tsx";
import RoundService from "../services/RoundService.tsx";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";

const IndexScreen = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState<PlayerInterface[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<(PlayerInterface | null)[]>(Array(24).fill(null));
    const today = format(new Date().toISOString().split("T")[0], "dd-MM-yyyy");

    useEffect(() => {
        const fetchPlayers = async () => {
            const response = await PlayerService.getPlayers();
            const sortedPlayers = response.sort((a, b) => a.name.localeCompare(b.name));
            setPlayers(sortedPlayers);
        };
        fetchPlayers().then();
    }, []);

    const handlePlayerSelection = (index: number, selectedPlayer: PlayerInterface | null) => {
        if (!selectedPlayer) return; // Ignorer null-valg
        const updatedSelections = [...selectedPlayers];
        updatedSelections[index] = selectedPlayer;
        setSelectedPlayers(updatedSelections);
    };

    const handleConfirmMatches = async () => {
        const roundId = today; // Formateret dato som ID

        // Valider, at alle spillere er valgt
        const hasIncompleteSelection = selectedPlayers.some((player) => !player?.id);
        if (hasIncompleteSelection) {
            alert("Alle kampe skal udfyldes!");
            return;
        }

        // Opret kampe
        const matches: MatchInterface[] = Array.from({ length: 6 }).map((_, matchIndex) => {
            const team1 = {
                player1: selectedPlayers[matchIndex * 4]!.id as string, // Non-null assertion + typecast
                player2: selectedPlayers[matchIndex * 4 + 1]!.id as string,
                points: 0,
            };

            const team2 = {
                player1: selectedPlayers[matchIndex * 4 + 2]!.id as string, // Non-null assertion + typecast
                player2: selectedPlayers[matchIndex * 4 + 3]!.id as string,
                points: 0,
            };

            return { team1, team2 };
        });

        try {
            // Send data til backend
            await RoundService.createRound(roundId, matches);
            alert(`Runde ${roundId} gemt med succes!`);
        } catch (error) {
            console.error("Error saving round:", error);
            alert("Der opstod en fejl under gemning af runden.");
        }
    };

    const handleSeeRounds = () => {
        navigate("/rounds");
    }





    return (
        <>
            <div className="mt-4">
                <div className="flex justify-end">
                <Button onClick={handleSeeRounds} className="animate-pulse bg-red-500 text-white p-2 rounded-md">
                    Se runder
                </Button>
                </div>
            {Array.from({ length: 6 }).map((_, groupIndex) => (
                <div key={groupIndex} className="mb-10">
                    <h2 className="text-2xl font-bold text-center text-white mb-4">
                        Kamp {groupIndex + 1}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, index) => {
                            const globalIndex = groupIndex * 4 + index;
                            return (
                                <Listbox
                                    key={globalIndex}
                                    value={selectedPlayers[globalIndex]}
                                    onChange={(selectedPlayer) =>
                                        handlePlayerSelection(globalIndex, selectedPlayer)
                                    }
                                >
                                    <div
                                        className={`relative border-4 rounded-lg ${
                                            index < 2 ? "border-blue-500" : "border-red-500"
                                        }`}
                                    >
                                        <ListboxButton className="w-full h-20 text-center bg-white text-black rounded-md px-2 py-1">
                                            {selectedPlayers[globalIndex]?.name || "Vælg spiller"}
                                        </ListboxButton>
                                        <ListboxOptions className="absolute mt-1 w-full bg-white shadow-md rounded-md z-50 max-h-60 overflow-y-auto text-black">
                                            {players.map((player) => (
                                                <ListboxOption
                                                    key={player.id}
                                                    value={player}
                                                    className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                                                >
                                                    {player.name}
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>


                                    </div>
                                </Listbox>
                            );
                        })}
                    </div>
                </div>
            ))}
            <div className="flex justify-center mt-10">
                <button
                    className="rounded-2xl bg-sky-500 p-2 text-3xl text-white mb-52"
                    onClick={handleConfirmMatches}
                >
                    Bekræft valg
                </button>
            </div>
            </div>
        </>
    );
};

export default IndexScreen;
