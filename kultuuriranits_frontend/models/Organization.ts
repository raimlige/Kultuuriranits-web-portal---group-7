export interface Organization {
    id: number;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    type: string;
    phone?: string;
    email?: string;
}