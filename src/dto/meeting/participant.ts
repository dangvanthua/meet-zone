export interface ParticipantDto {
    participant_id: string;
    user_id: string;
    role: string;
    joinedAt: string;
    leftAt?: string;
}