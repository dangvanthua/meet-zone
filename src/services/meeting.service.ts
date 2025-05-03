import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CreateMeetingDto } from "../dto/meeting/create_meeting";
import { Observable } from "rxjs";
import { ApiResponse } from "../dto/api/api_res";
import { MeetingDto } from "../dto/meeting/meeting";

@Injectable({
  providedIn: 'root'    
})
export class MeetingService {

    private apiUrl = `${environment.apiUrl}/meetings`;
    
    constructor(private http: HttpClient) { }

    createMeeting(): Observable<ApiResponse<MeetingDto>> {
        return this.http.post<ApiResponse<MeetingDto>>(`${this.apiUrl}`, null);
    }

    createMeetingSchedule(dto: CreateMeetingDto): Observable<ApiResponse<MeetingDto>> {
        return this.http.post<ApiResponse<MeetingDto>>(`${this.apiUrl}/schedule`, dto);
    }

    joinMeeting(code: string, userId: string): Observable<ApiResponse<MeetingDto>> {
        return this.http.post<ApiResponse<MeetingDto>>(`${this.apiUrl}/meetings/${code}/join?user_id=${userId}`, {});
    }

    leaveMeeting(meetingCode: string, userId: string): Observable<ApiResponse<void>> {
        const params = new HttpParams().set('user_id', userId);
        return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${meetingCode}/leave`, null, { params });
    }

    endMeeting(meetingCode: string, userId: string): Observable<ApiResponse<MeetingDto>> {
        const params = new HttpParams().set('user_id', userId);
        return this.http.post<ApiResponse<MeetingDto>>(`${this.apiUrl}/${meetingCode}/end`, null, { params });
    }

    verifyMeeting(meetingCode: string): Observable<ApiResponse<Boolean>> {
        const params = new HttpParams().set('meeting_code', meetingCode);
        return this.http.get<ApiResponse<Boolean>>(`${this.apiUrl}/verify`, { params });
      }
}