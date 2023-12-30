import type { Database } from "$lib/database.types";
import { createClient } from "@supabase/supabase-js";
import { data_loading, toasts, type Template } from "./storage";


const SUPABASE_URL = "https://cbgvduembguyfxjbifpb.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZ3ZkdWVtYmd1eWZ4amJpZnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5ODM1MjEsImV4cCI6MjAxODU1OTUyMX0.G9q2dhfHgjacUYW1cBXel-0CCfJFS-epKDT9h3CS04I"
const BASE_URL = "http://ingegneria.eu-4.evennode.com";


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
    return await fetch(`${BASE_URL}/api/mandamessaggio`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from,
            to,
            content,
        }),
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

export const get_contacts = async (to_number: number): Promise<ContactType[]> => {
    // console.log(get(session))
    if (!to_number) {
        throw new Error("Calling get_contacts with no number")
    }

    const query = supabaseClient
        .from("contact_msg_tags")
        .select("*")
        .eq("owner", to_number)
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

    const response = await fetch(`${BASE_URL}/api/messaggi?from=${caller_number}&to=${chat_number}`);
    const messages = await response.json();
    console.log(messages);
    if (!messages || !response.ok) {
        toasts.error("Impossibile caricare i messaggi")
        return [];
    }
    else {
        return messages;
    }

    /*fetch(`http://localhost:9999/api/messaggi?from=${caller_number}&to=${chat_number}`)
    .then((data)=>{
        console.log(data);
        if(data.ok){
            console.log("test!");
        }
        if (!data) {
            console.log(data+"minchei")
            toasts.error("Impossibile caricare i messaggi, non ce ne sono")
            return [];
        }
        return data;
    });*/
    toasts.error("Errore fatale nel caricamento messaggi")
    return [];
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
    toasts.info("Il cliente non è più disiscritto")
    data_loading.reload();
}

export const remove_customer = async (wa_id: number, ecom_wa_id: number) => {
    const response = await fetch(`${BASE_URL}/api/rimuovicliente?number=${wa_id}&ecommercenumber=${ecom_wa_id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        toasts.error("Impossibile eliminare cliente")
        return;
    }
    toasts.info("Il cliente è ora disiscritto")
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