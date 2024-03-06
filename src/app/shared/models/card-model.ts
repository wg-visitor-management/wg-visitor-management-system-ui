export interface Card {
  card_id: string;
  cardStatus: string;
}

export interface CardResponse {
  cardStatus: string;
  data: Card[];
}
