import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable, Subject, tap } from "rxjs";

import {
  Visitor,
  VisitorGetIdResponse,
  VisitorGetResponse,
  VisitorPostResponse,
  VisitorPutModel,
  VisitorPutResponse
} from "../models/visitor";
import { environment } from "src/environments/environment";

export interface visitorPost {
  phoneNumber: string;
  idProofNumber: string;
  lastName: string;
  address: string;
  email: string;
  organization: string;
  firstName: string;
  vistorPhotoBlob: string;
  idPhotoBlob: string;
}

@Injectable({ providedIn: "root" })
export class VisitorService {
  base_url = environment.apiUrl;
  visitors: Visitor[] = [];
  selectedVisitor: Visitor;
  visitorDetailUpdate = new Subject<boolean>();

  constructor(private http: HttpClient) {}
  getData(
    queryString = "",
    nextPageToken = "",
    limit = 10,
    organization = ""
  ): Observable<VisitorGetResponse> {
    return this.http.get<VisitorGetResponse>(`${this.base_url}/visitor`, {
      params: {
        name: queryString,
        nextPageToken: nextPageToken,
        maxItems: limit,
        organization: organization
      }
    });
  }

  getVisitor(id: string): Observable<VisitorGetIdResponse> {
    return this.http
      .get<VisitorGetIdResponse>(`${this.base_url}/visitor/${id}`)
      .pipe(
        tap((data) => {
          this.selectedVisitor = data.data;
        })
      );
  }

  addVisitor(data: visitorPost): Observable<VisitorPostResponse> {
    return this.http.post<VisitorPostResponse>(
      `${this.base_url}/visitor`,
      data
    );
  }

  updateVisitor(
    visitorId: string,
    data: VisitorPutModel
  ): Observable<VisitorPutResponse> {
    return this.http.put<VisitorPutResponse>(
      `${this.base_url}/visitor/${visitorId}`,
      data
    );
  }
}
