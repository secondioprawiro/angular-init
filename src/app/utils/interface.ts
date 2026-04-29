export interface Experience{
    company:string;
    position:string;
    period:string;
}

export interface CvData {
    name: string;
    role: string;
    email: string;
    experience: Experience[];
}

export interface TodoItem {
    id: number;
    task: string;
    isCompleted: boolean;
}

export interface PokemonResultResponse {
    name: string;
    url: string;
}

export interface PokemonDetail {
    id: number;
    name: string;
    url: string;
    types: string[];
    height: number;
    weight: number;    
    image?: string;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonResultResponse[];
}
