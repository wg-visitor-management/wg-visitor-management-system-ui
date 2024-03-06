export interface Visit {
  name: string;
  organization: string;
  phNumber: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  purpose: string;
  toMeet: string;
  comments: string;
  cardId: string;
  checkedInBy: string;
  visitId: string;
  approvalStatus?: string;
  approvedBy?: string;
  approvalTime?: string;
}
export interface VisitBody {
  data: {
    name: string;
    organization: string;
    phNumber: string;
    date: string;
    checkInTime: string;
    checkOutTime: string;
    purpose: string;
    toMeet: string;
    comments: string;
    cardId: string;
    checkedInBy: string;
    visitId: string;
    approvalStatus?: string;
    approvedBy?: string;
    approvalTime?: string;
  };
  message: string;
}

export interface VisitGetResponse {
  status: string;
  data: Visit[];
}

export interface VisitCheckOutResponse {
  status: string;
  data: {
    message: string;
  };
}

export interface VisitRequestBody {
  visitorId: string;
  name: string;
  organization: string;
  phNumber: string;
  purpose: string;
  visitType: string;
  toMeet: string;
  cardId: string;
  comments: string;
}
