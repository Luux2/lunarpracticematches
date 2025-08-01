import {useEffect, useMemo, useState} from "react";
import {PracticeTeamInterface} from "../utils/interfaces.ts";
import PracticeTeamService from "../services/PracticeTeamService.tsx";
import BackArrow from "../components/BackArrow.tsx";
import {ChevronRightIcon} from "@heroicons/react/24/outline";
import {format, parse} from "date-fns";
import {da} from "date-fns/locale";
import {registerLocale} from "react-datepicker";

registerLocale("da", da);

const ViewPracticeTeamsScreen = () => {
    const [practiceTeams, setPracticeTeams] = useState<PracticeTeamInterface[]>([]);
    const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPracticeTeams = async () => {
            try {
                const response = await PracticeTeamService.getPracticeTeams();
                const sortedTeams = response.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
                setPracticeTeams(sortedTeams);
            } catch (error) {
                console.error("Error fetching practice teams:", error);
            }
        };
        Promise.all([fetchPracticeTeams()]).then(() => setIsLoading(false));
    }, []);

    const groupedTeams = useMemo(() => {
        const teamsArray = Object.values(practiceTeams); // Konverter objektet til en array
        const today = new Date(); // Dagens dato
        today.setHours(0, 0, 0, 0);
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
            {Object.keys(groupedTeams).length > 0 ? (
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
                            >
                                <div className="flex justify-between items-center">
                                    <div className="ml-2 text-lg font-semibold cursor-pointer">{date}</div>
                                    <ChevronRightIcon
                                        className={`h-6 mr-2 cursor-pointer transition-transform duration-300 ${
                                            expandedDates.has(date) ? "rotate-90" : ""
                                        }`}
                                    />
                                </div>
                                {expandedDates.has(date) && (
                                    <ul className="mt-4 border-gray-300">
                                        {groupedTeams[date].map((team) => (
                                            <li key={`${date}-${team.id}`} className="mb-4">
                                                <ul>
                                                    {team.players.map((player) => (
                                                        <li
                                                            key={player}
                                                            className="mb-2 p-2 mx-1 cursor-pointer hover:bg-gray-700 border-2 border-[#232e39] rounded-xl"
                                                        >
                                                            {player}
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
            ) : (
                <p className="text-center mt-10">Ingen kommende træningshold oprettet... endnu!</p>
            )}
        </div>
    );

};

export default ViewPracticeTeamsScreen;
