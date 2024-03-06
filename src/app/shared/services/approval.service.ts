import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import {
  ApprovalPatch,
  ApprovalPost,
  ApprovalPostResponse
} from "../models/approval";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class ApprovalService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  patchApproval(id: string, approvalStatus: string): Observable<ApprovalPatch> {
    return this.httpClient.patch<ApprovalPatch>(
      `${this.baseUrl}/approval/${id}`,
      {
        status: approvalStatus
      }
    );
  }

  postApproval(data: ApprovalPost): Observable<ApprovalPostResponse> {
    return this.httpClient.post<ApprovalPostResponse>(
      `${this.baseUrl}/approval`,
      data
    );
  }
}
