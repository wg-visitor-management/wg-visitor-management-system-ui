export interface ApprovalPost {
  name: string;
  organization: string;
  phNumber: string;
  purpose: string;
  visitId: string;
}
export interface ApprovalPatch {
  status: string;
  data: {
    message: string;
    visitId: string;
    approvedBy: string;
    status: string;
  };
}
export interface ApprovalPostResponse {
  status: string;
  data: {
    message: string;
  };
}
