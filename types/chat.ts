import { Message } from "./message";

export type Chat = {
    id: string;
    title: string;
    messages: Message[],
    createdAt: string;
    focusMode: string;
}