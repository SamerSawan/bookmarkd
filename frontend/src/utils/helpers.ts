import { Shelf } from "./models";

export function getShelfIdByName(shelves: Shelf[], name: string): string | null {
    const shelf = shelves.find(s => s.name === name);
    return shelf ? shelf.id : null;
}