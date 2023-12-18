import { get_numbers } from "$lib/database";

export async function load() {
    return { numbers: await get_numbers() }
}

export const ssr = false;

