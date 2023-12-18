import type { Database } from "$lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { data_loading, toasts, type Template } from "./storage";


const SUPABASE_URL = "https://gckekeaekbpqdxtrmmon.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdja2VrZWFla2JwcWR4dHJtbW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkxNjg0NTMsImV4cCI6MjAwNDc0NDQ1M30.1JiXvTWPvPZQMGMsa95BmN3Gz9LHDtubexBDiDvk1Cg"


export type RowOf<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export interface ContactType extends Omit<Database["public"]["Views"]["contact_msg_tags"]["Row"], "timestamp" | "wa_id"> {
    timestamp: Date,
    wa_id: number
};
// export { Database }

// export interface ContactType {
//     wa_id: number,
//     name: string | null,
//     last_message?: Date
// }

export const supabaseClient = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const send_message_raw = async (from: number, to: number, content: any) => {
    return supabaseClient.functions.invoke('send_message', {
        body: {
            from,
            to,
            content
        }
    });
}
export async function send_message(template: string, input: string, from: number, to: number) {
    let content: any;
    if (!template) {
        content = {
            type: 'text',
            text: {
                body: input
            }
        };
    } else {
        content = {
            type: 'template',
            template: {
                name: template,
                language: {
                    code: 'it'
                }
            }
        };
        if (input) {
            const formatted_parameters = input.split(',').map((p) => {
                return {
                    type: 'text',
                    text: p
                };
            });
            content.template['components'] = [
                {
                    type: 'body',
                    parameters: formatted_parameters
                }
            ];
        }
    }

    send_message_raw(from, to, content)
        .then(async (res: any) => {
            console.log(res);
            const err: any = (await res.error?.context.json());
            if (res.data) {
                toasts.success("Messaggio mandato con successo");
            } else {
                console.log(err)
                toasts.error("Errore nell'invio del messaggio");
            }
        })
        .catch((e: any) => {
            console.error(e);
            toasts.error("Errore nell'invio del messaggio");
            //input = '';
        });
}




export const get_templates = async (from: number): Promise<Template[]> => {
    const { data, error } = await supabaseClient.functions.invoke("get_templates", {
        body: {
            from
        }
    })

    if (!data || error) {
        console.log(data, error);
        return [];
    } else {
        const templates: Template[] = [];
        for (const keyval of Object.entries(data.data)) {
            const value: any = keyval[1];
            templates.push({
                text: value.components[0].text,
                name: value.name
            })
        }
        return templates;
    }

}



export const login = async (email: string, password: string) => {
    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password,
        })
    if (error) {
        toasts.error("Problema con il login: " + error.message)
    } else if (data) {
        toasts.info("Login effettuato con successo")
    }
    data_loading.reload();
}

export const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) {
        toasts.info("Logout effettuato con successo")
    } else {
        toasts.error("Problema con il logout: " + error.message)
    }
    data_loading.reload();
}

export const get_numbers = async (): Promise<
    {
        wa_id: number,
        name: string | null
    }[]
> => {
    const { data, error } = await supabaseClient
        .from("ecom_setup")
        .select("owner, ecom_id")
        .not('owner', 'is', null)
    // console.log(data, error);
    // return [{ wa_id: 123, name: "test" }];

    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile caricare i numeri")
        return [];
    }

    return data.map(({ ecom_id, owner }) => {
        if (owner == null) {
            throw new Error("Owner null")
        }
        return { name: ecom_id, wa_id: owner };
    });
}

export const get_contacts = async (to_number: number, show_sent: boolean): Promise<ContactType[]> => {
    // console.log(get(session))
    if (!to_number) {
        throw new Error("Calling get_contacts with no number")
    }
    // const { data, error } = await supabaseClient.rpc("get_contacts", { to_number, show_sent });
    const query = supabaseClient
        .from("contact_msg_tags")
        .select("*")
        .eq("owner", to_number)
    // .eq("");
    if (!show_sent) {
        query.eq("replied", true);
    }
    const { data, error } = await query;
    // console.log(data)

    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile caricare i contatti")
        return [];
    }
    return data.map(o => {
        if (o.timestamp == null || o.wa_id == null) {
            throw new Error("timestamp is null")
        }
        return {
            ...o,
            timestamp: new Date(o.timestamp),
            wa_id: o.wa_id
        }
    });
}

export const get_messages = async (caller_number: number, chat_number: number): Promise<RowOf<"messages">[]> => {
    if (!caller_number || !chat_number) {
        throw new Error("campi mancanti")
    }
    const { data, error } = await supabaseClient
        .from("messages")
        .select("*")
        .or(`and(from.eq.${caller_number},to.eq.${chat_number}),and(from.eq.${chat_number},to.eq.${caller_number})`)
        .order("timestamp", { ascending: true })
    // const { data, error } = await supabaseClient
    //     .rpc('get_messages', { current_number: caller_number, chat_number });
    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile caricare i messaggi")
        return [];
    }
    return data;
}

export const get_boradcasts = async (owner: number): Promise<Database["public"]["Views"]["broadcasts_summary"]["Row"][]> => {
    const { data, error } = await supabaseClient
        .from("broadcasts_summary")
        .select("*")
        .eq("owner", owner)

    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile caricare i broadcasts")
        return [];
    }

    return data;
}

export const create_broadcast = async (owner: number, broadcast_name: string): Promise<void> => {
    const { data, error } = await supabaseClient
        .from("broadcasts")
        .insert({ broadcast_name, owner })
        .select()
        .single()

    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile creare il broadcast")
        return;
    }

    data_loading.reload();
    return;
}

export interface BroadcastWithContacts extends RowOf<"broadcasts"> {
    broadcasts_contacts: RowOf<"broadcasts_contacts">[]
}
export const get_boradcast_contacts = async (owner: number, broadcast_id_int: number): Promise<BroadcastWithContacts> => {
    const { data, error } = await supabaseClient
        .from("broadcasts")
        .select("*, broadcasts_contacts (*)")
        .eq("id", broadcast_id_int)
        .eq("owner", owner)
        .single()

    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile caricare il broadcast")
        throw new Error("Impossibile caricare il broadcast")
        // return;
    }

    return data;
}

export const insert_broadcast_contact = async (broadcast_id: number, wa_ids: number[]): Promise<void> => {
    const { data, error } = await supabaseClient
        .from("broadcasts_contacts")
        .insert(wa_ids.map(wa_id => { return { broadcast: broadcast_id, wa_id } }))
        .select()

    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile aggiungere il/i contatto/i")
        return;
    }

    data_loading.reload();
    return;
}

export const remove_broadcast_contact = async (broadcast_id: number, wa_id: number): Promise<void> => {
    const { data, error } = await supabaseClient
        .from("broadcasts_contacts")
        .delete()
        .eq("broadcast", broadcast_id)
        .eq("wa_id", wa_id)
        .select()
        .single()

    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile rimuovere il contatto")
        return;
    }

    data_loading.reload();
    return;
}

export const update_broadcast = async (
    id: number,
    updates: {
        broadcast_name?: string;
        send_started?: boolean;
        message_content?: any;
    }
): Promise<void> => {
    const { data, error } = await supabaseClient
        .from("broadcasts")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile aggiornare il broadcast")
        return;
    }
    toasts.success("Aggiornato")
    data_loading.reload();
    return;
}

export const remove_tag = async (ecom_wa_id: number, wa_id: number, tag: string) => {
    const { data, error } = await supabaseClient
        .from("tags")
        .delete()
        .eq("ecom_wa_id", ecom_wa_id)
        .eq("wa_id", wa_id)
        .eq("tag", tag)
        .select()
        .single()
    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile rimuovere il tag")
        return;
    }
    data_loading.reload();
}

export const add_tag = async (ecom_wa_id: number, wa_id: number, tag: string) => {
    const { data, error } = await supabaseClient
        .from("tags")
        .insert({ ecom_wa_id, tag, wa_id })
        .select()
        .single()
    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile aggiungere il tag")
        return;
    }
    data_loading.reload();
}

export const get_tags = async (ecom_wa_id: number): Promise<string[]> => {
    const { data, error } = await supabaseClient
        .from("unique_tags")
        .select("tag")
        .eq("ecom_wa_id", ecom_wa_id)
    if (!data || error) {
        console.log(error, data)
        toasts.error("Impossibile caricare i tag")
        return [];
    }
    return data.map(d => d.tag || "ERRORE_NEL_TAG");
}