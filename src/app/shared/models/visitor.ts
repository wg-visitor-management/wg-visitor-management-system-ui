export interface Visitor {
  visitorId: string;
  phoneNumber: string;
  idProofNumber: string;
  lastName: string;
  address: string;
  email: string;
  organization: string;
  firstName: string;
  profilePictureUrl?: string;
  idProofPictureUrl?: string;
}

export interface VisitorGetResponse {
  status: string;
  data: {
    visitors: Visitor[];
    nextPageToken: string;
  };
}
export interface VisitorGetIdResponse {
  status: string;
  data: Visitor;
}

export interface VisitorPostResponse {
  status: string;
  data: {
    visitorId: string;
    profilePictureUrl: string;
    idProofPictureUrl: string;
  };
}

export interface VisitorPutModel {
  oldFirstName: string;
  oldLastName: string;
  phoneNumber: string;
  lastName: string;
  address: string;
  email: string;
  organization: string;
  firstName: string;
  profilePictureUrl?: string;
  idProofPictureUrl?: string;
}

export interface VisitorPutResponse {
  status: string;
  data: {
    phoneNumber: string;
    profilePictureUrl: string;
    organization: string;
    idProofPictureUrl: string;
    lastName: string;
    address: string;
    email: string;
    firstName: string;
    visitorId: string;
    idProofNumber: string;
  };
}
