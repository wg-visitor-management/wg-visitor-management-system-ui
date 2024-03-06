import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, catchError, map, of, tap } from "rxjs";

import { Card, CardResponse } from "../models/card-model";
import { environment } from "src/environments/environment";

export enum card_status {
  available = "available",
  occupied = "occupied",
  discarded = "discarded"
}

@Injectable({ providedIn: "root" })
export class CardService {
  baseUrl = environment.apiUrl;

  cards: Card[] = [];
  constructor(private http: HttpClient) {}

  getData(): Observable<CardResponse> {
    return this.http.get<CardResponse>(`${this.baseUrl}/card`);
  }

  addCard(value: string[]): Observable<CardResponse> {
    return this.http.post<CardResponse>(`${this.baseUrl}/card`, value);
  }

  discardCard(id: string): Observable<CardResponse> {
    return this.http.put<CardResponse>(`${this.baseUrl}/card/${id}`, {
      status: "discarded"
    });
  }
  updateCardStatus(
    id: string | undefined,
    status: string,
    visitId: string
  ): Observable<CardResponse> {
    return this.http.put<CardResponse>(`${this.baseUrl}/card/${id}`, {
      status: status,
      visitId: visitId
    });
  }
  getAvailableCards(): Observable<Card[]> {
    return this.getData().pipe(
      tap((cards: CardResponse) => {
        this.cards = this.filterAvailableCards(cards.data);
        this.sortCardsById(this.cards);
      }),
      catchError((error) => {
        return of(error);
      }),
      map(() => this.cards)
    );
  }

  private filterAvailableCards(cards: Card[]): Card[] {
    return cards.filter((card: Card) => card.cardStatus === "available");
  }

  sortCardsById(cards: Card[]): void {
    cards.sort((a: Card, b: Card) => parseInt(a.card_id) - parseInt(b.card_id));
  }
}
