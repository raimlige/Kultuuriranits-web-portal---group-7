import { Role } from "./Role";
import { Organization } from "./Organization";

export interface Person {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    personalCode: string;
    role?: Role;
    organization?: Organization;
}