import {createStore} from "vuex"
import {DateTime} from "luxon";
import type Message from "@/Types/Message";
import type Participant from "@/Types/Participant";
import type StateData from "@/Types/StateData";

export default () => {
    return createStore<StateData>({
        state: {
            messages: [],
            chatTitle: '',
            placeholder: '',
            participants: [],
            myself: {id: 0, name: ''},
        },

        mutations: {
            newMessage: (state: any, message: Message) => {
                message.timestamp = message.timestamp.toISO();
                message.myself = message.participantId === state.myself.id;
                state.messages = [...state.messages, message];
            },

            setParticipants: (state: any, participants: Array<Participant>) => (state.participants = participants),

            setMyself: (state: any, myself: Participant) => (state.myself = myself),

            setMessages: (state: any, messages: Array<Message>) => (state.messages = messages.map(message => {
                if (message.timestamp) (typeof message.timestamp == 'object') && (message.timestamp = DateTime.fromObject(message.timestamp).toISO())
                else {
                    message.timestamp = DateTime.local().toISO();
                }

                if (!("myself" in message)) {
                    message.myself = message.participantId === state.myself.id;
                }

                return message
            })),

            setChatTitle: (state: any, title: string) => (state.chatTitle = title),

            setPlaceholder: (state: any, placeholder: string) => (state.placeholder = placeholder),
        },

        actions: {
            newMessage: (context: any, message: Message) => (context.commit('newMessage', message)),

            setMessages: (context: any, messages: Message[]) => (context.commit('setMessages', messages)),

            setParticipants: (context: any, participants: Participant[]) => (context.commit('setParticipants', participants)),

            setMyself: (context: any, myself: Participant) => (context.commit('setMyself', myself)),

            setChatTitle: (context: any, title: string) => (context.commit('setChatTitle', title)),

            setPlaceholder: (context: any, placeholder: string) => (context.commit('setPlaceholder', placeholder)),
        },

        getters: {
            getParticipantById: (state: any) => (id: number): Participant => state.participants.find((participant: Participant) => participant.id === id),

            messages: (state: any) => {
                const messages: Array<Message> = [];
                state.messages.forEach((message: Message) => {
                    const newMessage: Message = {...message};
                    newMessage.timestamp = DateTime.fromISO(newMessage.timestamp);

                    messages.push(newMessage);
                });

                return messages;
            },

            myself: (state: any) => state.myself
        }
    })
}
