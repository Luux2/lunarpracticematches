import { useEffect, useState } from "react";
import {PlayerInterface, SmashTeamInterface} from "../utils/interfaces.ts";
import PlayerService from "../services/PlayerService.tsx";
import BackArrow from "../components/BackArrow.tsx";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {da} from "date-fns/locale";
import PracticeTeamService from "../services/PracticeTeamService.tsx";
import { format } from "date-fns";
import TeamService from "../services/TeamService.tsx";
import {useNavigate} from "react-router-dom";
registerLocale("da", da);


const PracticeTeamsScreen = () => {
    const navigate = useNavigate();
    const today = format(new Date(), 'dd/MM');
    const [players, setPlayers] = useState<PlayerInterface[]>([]);
    const [teams, setTeams] = useState<SmashTeamInterface[]>([]);
    const [selectedPlayers, setSelectedPlayers] = useState<(PlayerInterface | null)[]>(Array(8).fill(null));
    const [selectedTeam, setSelectedTeam] = useState<SmashTeamInterface | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            const response = await PlayerService.getPlayers();
            const sortedPlayers = response.sort((a, b) => a.name.localeCompare(b.name));
            setPlayers(sortedPlayers);
        };

        const fetchTeams = async () => {
            const response = await TeamService.getTeams();
            const filteredTeams = response.filter(team => team.name !== "Reserver");
            setTeams(filteredTeams);
        }

        Promise.all([fetchPlayers(), fetchTeams()]).then(() => setIsLoading(false));
    }, []);

    const handlePlayerSelection = (index: number, selectedPlayer: PlayerInterface | null) => {
        if (!selectedPlayer) return; // Ignore null selection
        const updatedSelections = [...selectedPlayers];
        updatedSelections[index] = selectedPlayer;
        setSelectedPlayers(updatedSelections);
    };

    const handleConfirmPracticeTeams = async () => {
        try {
            const selectedPlayerNames = selectedPlayers.map(player => player?.name);
            if (selectedPlayerNames.includes(undefined)) {
                alert("Vælg alle spillere før du fortsætter!");
                return;
            }

            const startTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

            const newPracticeTeam = {
                startTime,
                players: selectedPlayerNames as string[],
            };


            await PracticeTeamService.createPracticeTeams(newPracticeTeam);

            alert("Træningshold oprettet!");
            setSelectedPlayers(Array(8).fill(null));
            navigate("/view-practice-teams")
        } catch (error) {
            console.error("Fejl ved oprettelse af træningshold:", error);
            alert("Der opstod en fejl ved oprettelse af træningshold.");
        }
    };

    if (isLoading) {
        return <p className="text-center mt-10">Indlæser spillere...</p>;
    }



    return (
        <div className="mt-4">
            <BackArrow/>
            <div className="mb-10 space-y-4">
                <h1 className="text-3xl font-semibold text-center">Træningshold for {today}</h1>
            </div>


            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="col-span-2 mx-10 flex justify-center">
                    <select
                        name="teamselect"
                        value={selectedTeam?.id ?? "Vælg hold"}
                        onChange={(e) => {
                            const team = teams.find(t => t.id === e.target.value) || null;
                            setSelectedTeam(team);

                            if (team) {
                                const selected = team.players
                                    .map((playerName) => players.find(p => p.name === playerName) || null);
                                setSelectedPlayers(selected.concat(Array(8 - selected.length).fill(null)));
                            } else {
                                setSelectedPlayers(Array(8).fill(null));
                            }
                        }}

                        className="w-full border-2 border-[#232e39] rounded-lg px-3 py-2"
                    >
                        <option value="">Vælg hold</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>


                {Array.from({length: 8}).map((_, index) => (
                    <Listbox
                        key={index}
                        value={selectedPlayers[index]}
                        onChange={(selectedPlayer) =>
                            handlePlayerSelection(index, selectedPlayer)
                        }
                    >
                        <div className="relative border-2 rounded-lg border-[#232e39] mx-2">
                            <ListboxButton className="w-full h-16 text-center bg-white text-black rounded-md px-2 py-1">
                                {selectedPlayers[index]?.name || "Vælg spiller"}
                            </ListboxButton>
                            <ListboxOptions
                                className="absolute mt-1 w-full bg-white shadow-md rounded-md z-50 max-h-60 overflow-y-auto text-black"
                            >
                                {players
                                    .filter((player) => !selectedPlayers.some((selected) => selected?.id === player.id)) // Fjern allerede valgte spillere
                                    .map((player) => (
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
                ))}
            </div>

            <div className="flex justify-center mt-10">
                <button
                    className="rounded-xl p-2 text-3xl border-[#232e39] border-2 mb-52"
                    onClick={handleConfirmPracticeTeams}
                >
                    Bekræft valg
                </button>
            </div>
        </div>
    );
};

export default PracticeTeamsScreen;
