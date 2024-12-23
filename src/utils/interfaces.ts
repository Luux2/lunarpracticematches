export interface PlayerInterface {
    id?: string;
    name: string;
}

export interface TeamInterface {
    player1: string;
    player2: string;
    setScores?: number[]; // Foretrukken struktur
    firstSetPoints?: number; // Midlertidigt til kompatibilitet med backend
    secondSetPoints?: number;
    thirdSetPoints?: number;
    left?: string;
    right?: string;
}


export interface MatchInterface {
    id?: string;
    team1: TeamInterface;
    team2: TeamInterface;
    winner?: "team1" | "team2" | "not finished" | null;
    setWinners?: ("team1" | "team2" | "draw")[]; // Vindere af hvert sæt
}

export interface RoundInterface {
    id: string;
    matches: MatchInterface[];
}

export interface PracticeTeamInterface {
    id?: string; // Unikt ID (f.eks. test1)
    startTime: string; // ISO-timestamp for starttidspunktet
    endTime: string; // ISO-timestamp for sluttidspunktet
    players: string[]; // Array af spiller-ID'er (maks. 4 spillere)
}
