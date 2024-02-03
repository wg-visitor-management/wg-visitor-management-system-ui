export interface Visit {
  name: string;
  organization: string;
  ph_number: string;
  date: string;
  check_in_time: string;
  check_out_time: string;
  purpose: string;
  to_meet: string;
  comments: string;
  id_card: string;
  checked_in_by: string;
  status: string;
  approved_by?: string;
  approval_time?: string;
}
