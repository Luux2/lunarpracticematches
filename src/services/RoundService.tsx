import apiClient from "../utils/axiosBase";
import {MatchInterface, RoundInterface} from "../utils/interfaces.ts";

class RoundService {

    static async getRounds(): Promise<RoundInterface[]> {
        const response = await apiClient.get('/rounds');
        return response.data as RoundInterface[]; // Dette bør nu matche den opdaterede struktur
    }

    static async createRound(date: string, matches: MatchInterface[]): Promise<void> {
        await apiClient.post(`/rounds/${date}`, { matches });
    }

    static async updateMatchResult(roundId: string, matchId: string, updatedMatch: MatchInterface): Promise<void> {
        await apiClient.put(`/rounds/${roundId}/matches/${matchId}`, updatedMatch);
    }

}

export default RoundService;
