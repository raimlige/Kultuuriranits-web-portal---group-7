import { Program } from "./Program"

export interface Material {
    id: number;
    name: string;
    file: File;
    fileType: string;
    title: string;
    program: Program;
}