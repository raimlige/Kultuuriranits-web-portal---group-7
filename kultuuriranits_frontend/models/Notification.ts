import { Organization } from "./Organization";

export interface Notification {
    id: number,
    title: string,
    message: string,
    status: string,
    createdAt: string,
    organization?: Organization
}