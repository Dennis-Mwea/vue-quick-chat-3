import {DateTime} from "luxon";

export default interface Message {
    type: string
    viewed: boolean
    content: string
    uploaded: boolean
    participantId: number
    timestamp: DateTime
    preview?: string|null
    src?: string
    myself?:boolean|null
}