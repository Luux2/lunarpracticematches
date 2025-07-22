import apiClient from "../utils/axiosBase.ts";
import {SmashTeamInterface} from "../utils/interfaces.ts";

class TeamService {
    static async getTeams(): Promise<SmashTeamInterface[]> {
        const response = await apiClient.get('/teams');
        return response.data;
    }

    static async createTeam(team: SmashTeamInterface): Promise<void> {
        await apiClient.post('/teams', team);
    }
}

export default TeamService;