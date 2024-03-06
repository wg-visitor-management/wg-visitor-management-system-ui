import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, Subject } from "rxjs";

import { Visitor } from "../models/visitor";
import {
  VisitBody,
  VisitCheckOutResponse,
  VisitGetResponse
} from "../models/visit-model";
import { environment } from "src/environments/environment";
import { DateService } from "./date.service";

export interface visitPost {
  visitorId: string;
  name: string;
  organization: string;
  phNumber: string;
  purpose: string;
  visitType: string;
  toMeet: string;
  checkedInBy?: string;
  cardId?: string;
  comments?: string;
}

@Injectable({ providedIn: "root" })
export class VisitService {
  visitData$ = new Subject<Visitor>();
  visitChanged$ = new Subject<boolean>();
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private dateService: DateService) {}

  getData(
    start_date?: string,
    end_date?: string
  ): Observable<VisitGetResponse> {
    if (start_date && end_date) {
      return this.http.get<VisitGetResponse>(`${this.baseUrl}/visit`, {
        params: {
          start_date: start_date,
          end_date: end_date
        }
      });
    } else {
      const ISODate = this.dateService.getIsoDate();
      const startISODate = ISODate.startISODate;
      const endISODate = ISODate.endISODate;

      return this.http.get<VisitGetResponse>(`${this.baseUrl}/visit`, {
        params: {
          start_date: startISODate,
          end_date: endISODate
        }
      });
    }
  }
  getDataByVisitorId(visitorId: string): Observable<VisitGetResponse> {
    return this.http.get<VisitGetResponse>(
      `${this.baseUrl}/visit?visitor_id=${visitorId}`
    );
  }

  checkOutVisitor(id: string): Observable<VisitCheckOutResponse> {
    return this.http.patch<VisitCheckOutResponse>(
      `${this.baseUrl}/visit/${id}`,
      {}
    );
  }

  addVisit(data: visitPost): Observable<VisitBody> {
    return this.http.post<VisitBody>(`${this.baseUrl}/visit`, data);
  }
}
