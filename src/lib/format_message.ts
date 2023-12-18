export function format(message: { data?: any }): {
    content: string,
    buttons: string[],
    note: string
} {
    let content: string = "";
    let buttons: string[] = [];
    let note: string = "";

    if (!message) {
        return {
            content, buttons, note
        }
    }

    const message_data: any = message.data;

    if (message_data?.template?.text) {
        message_data.template.template_data = message_data.template.text;
    }

    try {
        switch (message_data.type) {
            case 'text':
                content = message_data.text.body;
                break;
            case 'template':
                content = get_text_from_template(message_data.template);
                buttons = get_buttons_from_template(message_data.template);
                break;
            case 'reaction':
                content = message_data.reaction.emoji;
                note = 'reaction';
                break;

            case 'unsupported':
                content = 'Unsupported';
                note = 'Message not supported by WhatsApp API';
                break;
            case 'button':
                content = message_data.button.text;
                break;
            case 'interactive':
                switch (message_data.interactive.type) {
                    case 'button':
                        content = message_data.interactive.body.text;
                        buttons = message_data.interactive.action.buttons.map((b: any) => b.reply.title);
                        break;
                    case 'button_reply':
                        content = message_data.interactive.button_reply.title;
                        break;
                    default:
                        throw new Error('Interactive not supported');
                }

                break;
            default:
                content = JSON.stringify(message.data, null);
        }
    } catch (e) {
        console.log(e);
        content = JSON.stringify(message.data, null);
    }

    function get_text_from_template(template_msg: any): string {
        const parameters: string[] = template_msg.components
            ?.find((c: any) => c.type.toLowerCase() == 'body')
            .parameters?.map((component: any) => component.text);
        const template_text: string = template_msg.template_data.components.find(
            (c: any) => c.type.toLowerCase() == 'body'
        )?.text;

        const formatted_template = template_text.replace(/\{\{(\d+)\}\}/g, (match, p1) => {
            const index = parseInt(p1, 10) - 1; // Adjust index since array is 0-based and placeholders are 1-based
            return parameters[index] || match; // Use the placeholder as the default value if no replacement is found
        });

        return formatted_template;
    }
    function get_buttons_from_template(template_msg: any): string[] {
        const buttons: string[] = [];
        template_msg.template_data.components
            .find((c: any) => c.type.toLowerCase() == 'buttons')
            ?.buttons.map((button: any) => {
                buttons.push(button.text);
            });

        return buttons;
    }

    return {
        content,
        buttons,
        note
    }
}