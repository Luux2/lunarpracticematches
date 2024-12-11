export interface PlayerInterface {
    id?: string;
    name: string;
}

export interface TeamInterface {
    player1: string;
    player2: string;
    points?: number;
}


export interface RoundInterface {
    id: string; // Dato for runden i "DD-MM-YYYY"-format, fungerer som ID
    matches: MatchInterface[]; // Liste over kampe i runden
}


export interface MatchInterface {
    id?: string; // Valgfrit unikt ID for kampen (genereret af Firebase)
    team1: TeamInterface; // Første hold
    team2: TeamInterface; // Andet hold
}

