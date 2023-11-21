import type Participant from "@/Types/Participant";
import type Message from "@/Types/Message";

export default interface StateData {
    myself: Participant;
    messages: Message[];
    chatTitle: string;
    placeholder: string;
    participants: Participant[];
}