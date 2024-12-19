import { useEffect, useState } from "react";
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import {MatchInterface, PlayerInterface} from "../utils/interfaces.ts";
import PlayerService from "../services/PlayerService.tsx";
import RoundService from "../services/RoundService.tsx";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";
import BackArrow from "../components/BackArrow.tsx";

const CreateMatchesScreen = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState<PlayerInterface[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<(PlayerInterface | null)[]>(Array(48).fill(null));
    const today = format(new Date().toISOString().split("T")[0], "dd-MM-yyyy");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            const response = await PlayerService.getPlayers();
            const sortedPlayers = response.sort((a, b) => a.name.localeCompare(b.name));
            setPlayers(sortedPlayers);
        };
        Promise.all([fetchPlayers()]).then(() => setIsLoading(false));
    }, []);

    const handlePlayerSelection = (index: number, selectedPlayer: PlayerInterface | null) => {
        if (!selectedPlayer) return; // Ignorer null-valg
        const updatedSelections = [...selectedPlayers];
        updatedSelections[index] = selectedPlayer;
        setSelectedPlayers(updatedSelections);
    };

    const handleConfirmMatches = async () => {
        const roundId = today;

        const hasIncompleteSelection = selectedPlayers.some((player) => !player?.id);
        if (hasIncompleteSelection) {
            alert("Alle spillere skal vælges!");
            return;
        }

        const matches: MatchInterface[] = Array.from({ length: 12 }).map((_, matchIndex) => {
            const team1 = {
                player1: selectedPlayers[matchIndex * 4]!.id as string,
                player2: selectedPlayers[matchIndex * 4 + 1]!.id as string,
                setScores: [0, 0, 0],
            };

            const team2 = {
                player1: selectedPlayers[matchIndex * 4 + 2]!.id as string,
                player2: selectedPlayers[matchIndex * 4 + 3]!.id as string,
                setScores: [0, 0, 0],
            };

            return {
                team1,
                team2,
                winner: "not finished",
                setWinners: [],
            };
        });

        try {
            await RoundService.createRound(roundId, matches);
            alert(`Runde ${roundId} gemt med succes!`);
            setSelectedPlayers(Array(48).fill(null)); // Nulstil valgene
            navigate("/rounds");
        } catch (error) {
            console.error("Error saving round:", error);
            alert("Der opstod en fejl under gemning af runden.");
        }
    };

    if (isLoading) {
        return <p className="text-center mt-10">Indlæser spillere...</p>;
    }


    return (
        <>
            <BackArrow />
            {Array.from({ length: 12 }).map((_, groupIndex) => (
                <div key={groupIndex} className="mb-10">
                    <h2 className="text-2xl font-semibold text-center mb-4">
                        Kamp {groupIndex + 1}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mx-1">
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
                    className="rounded-xl border-2 border-[#232E39] p-2 text-3xl mb-52"
                    onClick={handleConfirmMatches}
                >
                    Bekræft valg
                </button>
            </div>
        </>
    );
};

export default CreateMatchesScreen;
