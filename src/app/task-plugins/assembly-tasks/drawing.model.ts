import { LocalEntity } from "../../models/local-entity";

export interface Drawing extends LocalEntity {
    name: string;
    type: string;
    size: string;
    file: string;
}