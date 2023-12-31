import { get_numerocontattati, get_numerorisposte } from "$lib/database";

export async function load({ params }) {
    return {
        numerocontattati: get_numerocontattati(params.current_number as unknown as number),
        numerorisposte: get_numerorisposte(params.current_number as unknown as number)
    }
}