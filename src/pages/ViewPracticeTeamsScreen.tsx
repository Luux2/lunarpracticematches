import {useEffect, useMemo, useState} from "react";
import {PlayerInterface, PracticeTeamInterface} from "../utils/interfaces.ts";
import PracticeTeamService from "../services/PracticeTeamService.tsx";
import BackArrow from "../components/BackArrow.tsx";
import PlayerService from "../services/PlayerService.tsx";
import {ChevronRightIcon} from "@heroicons/react/24/outline";
import {format, parse} from "date-fns";
import {da} from "date-fns/locale";
import {registerLocale} from "react-datepicker";

registerLocale("da", da);

const ViewPracticeTeamsScreen = () => {
    const [practiceTeams, setPracticeTeams] = useState<PracticeTeamInterface[]>([]);
    const [players, setPlayers] = useState<PlayerInterface[]>([]);
    const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPracticeTeams = async () => {
            try {
                const response = await PracticeTeamService.getPracticeTeams();
                setPracticeTeams(response);
            } catch (error) {
                console.error("Error fetching practice teams:", error);
            }
        };
        const fetchPlayers = async () => {
            try {
                const response = await PlayerService.getPlayers();
                setPlayers(response);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        };
        Promise.all([fetchPracticeTeams(), fetchPlayers()]).then(() => setIsLoading(false));
    }, []);

    const toggleDate = (date: string) => {
        setExpandedDates((prev) => {
            const updated = new Set(prev);
            if (updated.has(date)) {
                updated.delete(date); // Close
            } else {
                updated.add(date); // Open
            }
            return updated;
        });
    };

    const getPlayerName = (id: string): string => {
        const player = players.find((p) => p.id === id);
        return player ? player.name : "Ukendt spiller";
    };

    const groupedTeams = useMemo(() => {
        const teamsArray = Object.values(practiceTeams); // Konverter objektet til en array
        const today = new Date(); // Dagens dato
        return teamsArray
            .filter((team) => new Date(team.startTime) >= today) // Frasorter hold før i dag
            .reduce((acc, team) => {
                const date = format(new Date(team.startTime), "dd/MM/yyyy");
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(team);
                return acc;
            }, {} as Record<string, PracticeTeamInterface[]>);
    }, [practiceTeams]);

    useEffect(() => {
        if (Object.keys(groupedTeams).length > 0) {
            const firstDate = Object.keys(groupedTeams)[0]; // Få den første dato
            setExpandedDates(new Set([firstDate])); // Sæt den som åben fra start
        }
    }, [groupedTeams]);





    if (isLoading) {
        return <p className="text-center mt-10">Indlæser træningshold...</p>;
    }

    return (
        <div>
            <BackArrow />
            <h1 className="text-3xl text-center font-semibold">Privat time</h1>
            <ul>
                {Object.keys(groupedTeams)
                    .sort((a, b) =>
                        parse(a, "dd/MM/yyyy", new Date()).getTime() -
                        parse(b, "dd/MM/yyyy", new Date()).getTime()
                    )
                    .map((date) => (
                        <li
                            key={date}
                            className="border-b-2 pb-4 my-4"
                            onClick={() => toggleDate(date)}
                        >
                            <div className="flex justify-between items-center">
                                <div className="ml-2 text-lg font-semibold cursor-pointer">{date}</div>
                                <ChevronRightIcon
                                    className={`h-6 mr-2 cursor-pointer transition-transform duration-300 ${expandedDates.has(date) ? "rotate-90" : ""}`}
                                />
                            </div>
                        {expandedDates.has(date) && (
                            <ul className="mt-4 border-gray-300">
                                {groupedTeams[date].map((team) => (
                                    <li key={`${date}-${team.id}`} className="mb-4">
                                        <div className="font-semibold mb-3 border-t">
                                            <p className="p-2">{format(team.startTime, "HH:mm")} - {format(team.endTime, "HH:mm")}</p>
                                        </div>
                                        <ul>
                                            {team.players.map((playerId) => (
                                                <li
                                                    key={playerId}
                                                    className="mb-2 p-2 mx-1 cursor-pointer hover:bg-gray-700 border-2 border-[#232e39] rounded-xl"
                                                >
                                                    {getPlayerName(playerId)}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewPracticeTeamsScreen;
