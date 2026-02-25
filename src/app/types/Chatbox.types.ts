

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface Conversation {
    id: string;
    title: string;
    pipeline: string;
    messages: Message[];
}


export type {
    Message,
    Conversation
}