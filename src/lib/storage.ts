import { writable, readable } from 'svelte/store';
import { supabaseClient } from './database';
import type { Session } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { invalidateAll } from '$app/navigation';
// import { get_contacts, type RowOf } from './database';

export interface Template {
    name: string
    text: string,
}

// type LoadingData<T> = T | undefined;

export const session = readable<Session | null>(null, (set) => {
    //console.log("auth created")
    let old_session: Session | null = null;
    supabaseClient.auth.onAuthStateChange(async (event, ssession) => {
        if (ssession?.user.id != old_session?.user.id) {
            set(ssession);
            old_session = ssession;
            if (browser) {
                localStorage.storable = JSON.stringify(ssession)
            }
        }

    })
});

export interface Toast {
    message: string,
    type: "error" | "info" | "success"
}
export const toasts = (() => {
    const { subscribe, update } = writable<Toast[]>([]);

    return {
        subscribe,
        push: (t: Toast) => {
            update((ts) => {
                return [t, ...ts]
            });
            setTimeout(() => { toasts.dispatch(t) }, 3000)
        },
        dispatch: (t: Toast) => update((ts: Toast[]) => ts.filter(obj => obj !== t)),
        error: (message: string) => {
            toasts.push({ type: 'error', message })
        },
        info: (message: string) => {
            toasts.push({ type: 'info', message })
        },
        success: (message: string) => {
            toasts.push({ type: 'success', message })
        }
    };
})();


// <{ wa_id: number, name: string | null }[]>
// export const available_numbers = derived<Readable<Session | null>, ContactType[] | undefined>(session, (val, set) => {
//     set(undefined)
//     if (val) {
//         get_numbers().then((numbers) => {
//             set(numbers);
//             if (numbers.length == 1) {
//                 goto(`/auth/${numbers[0].wa_id}`)
//             }
//             // current_number.set(numbers?.at(0)?.wa_id)
//         })

//     }
// });

export const show_sent = writable<boolean>(false);


function create_data_loading() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        reload: () => {
            set(true);
            invalidateAll().then(() => set(false))
        },
    };
}

export const data_loading = create_data_loading();

export const hide_data = writable(false);

// export const contacts = writable<LoadingData<ContactType[]>>(undefined);

// export const templates = derived<Writable<number | undefined>, Template[] | undefined>(current_number, (cur_num, set) => {
//     set(undefined);
//     if (cur_num) {
//         supabaseClient.functions.invoke("get_templates", {
//             body: {
//                 from: cur_num
//             }
//         }).then(({ data, error }) => {
//             if (!data || error) {
//                 console.log(data, error)
//             } else {
//                 const templates: Template[] = [];
//                 for (const [, value] of Object.entries(data.data)) {
//                     templates.push({
//                         text: value.components[0].text,
//                         name: value.name
//                     })
//                 }
//                 set(templates)
//             }
//         });
//     }
// });
