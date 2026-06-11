import { Program } from "./Program";
import { Person } from "./Person";

export interface Feedback {
    id: number;

    text: string;
    rating: number;
    createdAt: string;

    person: Person;
    program: Program;
}