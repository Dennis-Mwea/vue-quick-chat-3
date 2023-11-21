import type {Timestamp} from "@/Types/Timestamp";

export default interface Message {
    type: string
    viewed: boolean
    content: string
    uploaded: boolean
    participantId: number
    timestamp: Timestamp
    preview?: boolean|null
    src?: string
    myself?:boolean|null
}