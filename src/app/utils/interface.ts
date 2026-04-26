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

