import { Category } from "./Category";
import { Organization } from "./Organization";
import { Material } from "./Material";

export interface Program {
    id: number;
    title: string;
    description: string;
    shortDescription: string;

    connection: string;
    connectionKeys: string[];

    pricePerStudent: number;
    durationMinutes: number;

    //targetGroup: string;
    targetGroups: string[];
    //language: string;
    languages: string[];

    minGroupSize: number;
    maxGroupSize: number;
    location: string;
    status: string;
    averageRating?: number;

    wheelchair: boolean;
    outdoor: boolean;
    hev: boolean;
    lak: boolean;

    addInfo: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    county: string;

    createdAt: string;
    updatedAt: string;

    organization?: Organization | null;

    imageName: string | null;
    imageType: string | null;

    category: Category | null;

    materials?: Material[];
}