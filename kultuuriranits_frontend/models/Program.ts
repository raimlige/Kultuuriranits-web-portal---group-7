import { Category } from "./Category";
import { Organization } from "./Organization";

export interface Program {

    id: number;

    title: string;
    description: string;
    pricePerStudent: number;
    durationMinutes: number;
    targetGroup: string;
    minGroupSize: number;
    maxGroupSize: number;
    location: string;
    language: string;
    status: string;
    createdAt: string;
    updatedAt: string;

    organization?: Organization | null;

    imageName: string | null;
    imageType: string | null;

    category: Category | null;
}