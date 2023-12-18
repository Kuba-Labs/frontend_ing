import { get_contacts, get_templates } from '$lib/database.js';
import { show_sent } from '$lib/storage.js';
import { get } from 'svelte/store';

export async function load({ params: { current_number } }) {
    const current_number_number = parseInt(current_number);
    if (current_number_number.toString() != current_number) {
        throw new Error('current_number must be a number');
    }

    //contacts.set(await get_contacts(current_number_number, get(show_sent)))
    return {
        templates: get_templates(current_number_number),
        current_number: current_number_number,
        contacts: await get_contacts(current_number_number, get(show_sent))
    }
}