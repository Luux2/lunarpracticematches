import apiClient from "../utils/axiosBase";
import { MatchInterface, RoundInterface } from "../utils/interfaces.ts";

class RoundService {
    static async getRounds(): Promise<RoundInterface[]> {
        const response = await apiClient.get('/rounds');
        return response.data as RoundInterface[];
    }

    static async createRound(date: string, matches: MatchInterface[]): Promise<void> {
        const formattedMatches = matches.map(match => ({
            ...match,
            team1: {
                ...match.team1,
                firstSetPoints: match.team1.setScores?.[0] || 0,
                secondSetPoints: match.team1.setScores?.[1] || 0,
                thirdSetPoints: match.team1.setScores?.[2] || 0,
            },
            team2: {
                ...match.team2,
                firstSetPoints: match.team2.setScores?.[0] || 0,
                secondSetPoints: match.team2.setScores?.[1] || 0,
                thirdSetPoints: match.team2.setScores?.[2] || 0,
            },
            winner: match.winner || "not finished",
        }));

        await apiClient.post(`/rounds/${date}`, { matches: formattedMatches });
    }

    static async updateMatchResult(roundId: string, matchId: string, updatedMatch: MatchInterface): Promise<void> {
        const formattedMatch = {
            ...updatedMatch,
            team1: {
                ...updatedMatch.team1,
                firstSetPoints: updatedMatch.team1.setScores?.[0] || 0,
                secondSetPoints: updatedMatch.team1.setScores?.[1] || 0,
                thirdSetPoints: updatedMatch.team1.setScores?.[2] || 0,
                left: updatedMatch.team1.left || updatedMatch.team1.player1, // Persister venstre spiller
                right: updatedMatch.team1.right || updatedMatch.team1.player2, // Persister højre spiller
            },
            team2: {
                ...updatedMatch.team2,
                firstSetPoints: updatedMatch.team2.setScores?.[0] || 0,
                secondSetPoints: updatedMatch.team2.setScores?.[1] || 0,
                thirdSetPoints: updatedMatch.team2.setScores?.[2] || 0,
                left: updatedMatch.team2.left || updatedMatch.team2.player1, // Persister venstre spiller
                right: updatedMatch.team2.right || updatedMatch.team2.player2, // Persister højre spiller
            },
            winner: updatedMatch.winner || "not finished",
        };

        await apiClient.put(`/rounds/${roundId}/matches/${matchId}`, formattedMatch);
    }

}

export default RoundService;
