import { get_messages, get_tags } from "$lib/database";

export async function load({ params: { wa_id, current_number } }) {
    const wa_id_number = parseInt(wa_id);
    const current_number_int = parseInt(current_number);
    // let messages: undefined | RowOf<"messages">[];
    const messages = get_messages(current_number_int, wa_id_number);
    //console.log(messages)
    const tags = get_tags(current_number_int);

    return { messages, wa_id: wa_id_number, tags };
}
