import { ParticipantDto } from "./participant";

export interface MeetingDto {
    meeting_id: string;
    host_id: string;
    user_name: string;
    role: string;
    meeting_code: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    participants: ParticipantDto[];
  }