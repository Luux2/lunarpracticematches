export interface PlayerInterface {
    id?: string;
    name: string;
}

export interface TeamInterface {
    player1: string;
    player2: string;
}


export interface MatchInterface {
    id?: string;
    team1: TeamInterface;
    team2: TeamInterface;
    sidesFixed?: boolean
    court: string;
}

export interface RoundInterface {
    id: string;
    matches: MatchInterface[];
}

export interface PracticeTeamInterface {
    id?: string;
    startTime: string;
    players: string[];
}

export interface SmashTeamInterface {
    id?: string;
    name: string;
    players: string[];
}