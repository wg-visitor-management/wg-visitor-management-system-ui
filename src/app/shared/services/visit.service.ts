import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VisitService {
  constructor() {}
  getData() {
    return of([
      {
        name: 'John Doe ',
        organization: 'ABC Company',
        ph_number: '1234567890',
        date: '01/01/2022',
        check_in_time: '09:00 AM',
        check_out_time: '05:00 PM',
        purpose: 'Meeting',
        to_meet: 'Jane Smith',
        comments: 'No comments',
        id_card: '123456789',
        checked_in_by: 'John Smith',
        status: 'Pending'
      },
      {
        name: 'John Doe 2',
        organization: 'XYZ Company',
        ph_number: '9876543210',
        date: '01/02/2022',
        check_in_time: '10:00 AM',
        check_out_time: '06:00 PM',
        purpose: 'Interview',
        to_meet: 'John Smith',
        comments: 'No comments',
        id_card: '987654321',
        checked_in_by: 'Jane Smith',
        status: 'Approved'
      },
      {
        name: 'John Doe 3',
        organization: 'DEF Company',
        ph_number: '5555555555',
        date: '01/03/2022',
        check_in_time: '11:00 AM',
        check_out_time: '07:00 PM',
        purpose: 'Training',
        to_meet: 'Jane Doe',
        comments: 'No comments',
        id_card: '555555555',
        checked_in_by: 'John Doe',
        status: 'Approved'
      },
      {
        name: 'John Doe 4',
        organization: 'GHI Company',
        ph_number: '9999999999',
        date: '01/04/2022',
        check_in_time: '12:00 PM',
        check_out_time: '08:00 PM',
        purpose: 'Presentation',
        to_meet: 'John Smith',
        comments: 'No comments',
        id_card: '999999999',
        checked_in_by: 'Jane Smith',
        status: 'Approved'
      },
      {
        name: 'John Doe 5',
        organization: 'JKL Company',
        ph_number: '1111111111',
        date: '01/05/2022',
        check_in_time: '01:00 PM',
        check_out_time: '09:00 PM',
        purpose: 'Client Meeting',
        to_meet: 'Jane Doe',
        comments: 'No comments',
        id_card: '111111111',
        checked_in_by: 'John Doe',
        status: 'Rejected'
      },
      {
        name: 'John Doe 6',
        organization: 'MNO Company',
        ph_number: '2222222222',
        date: '01/06/2022',
        check_in_time: '02:00 PM',
        check_out_time: '10:00 PM',
        purpose: 'Discussion',
        to_meet: 'John Smith',
        comments: 'No comments',
        id_card: '222222222',
        checked_in_by: 'Jane Smith',
        status: 'Rejected'
      },
      {
        name: 'John Doe 7',
        organization: 'PQR Company',
        ph_number: '3333333333',
        date: '01/07/2022',
        check_in_time: '03:00 PM',
        check_out_time: '11:00 PM',
        purpose: 'Meeting',
        to_meet: 'Jane Doe',
        comments: 'No comments',
        id_card: '333333333',
        checked_in_by: 'John Doe',
        status: 'Pending'
      },
      {
        name: 'John Doe 8',
        organization: 'STU Company',
        ph_number: '4444444444',
        date: '01/08/2022',
        check_in_time: '04:00 PM',
        check_out_time: '12:00 AM',
        purpose: 'Interview',
        to_meet: 'John Smith',
        comments: 'No comments',
        id_card: '444444444',
        checked_in_by: 'Jane Smith',
        status: 'Rejected'
      },
      {
        name: 'John Doe 9',
        organization: 'VWX Company',
        ph_number: '6666666666',
        date: '01/09/2022',
        check_in_time: '05:00 PM',
        check_out_time: '01:00 AM',
        purpose: 'Training',
        to_meet: 'Jane Doe',
        comments: 'No comments',
        id_card: '666666666',
        checked_in_by: 'John Doe',
        status: 'Approved'
      },
      {
        name: 'John Doe 10',
        organization: 'YZA Company',
        ph_number: '7777777777',
        date: '01/10/2022',
        check_in_time: '06:00 PM',
        check_out_time: '02:00 AM',
        purpose: 'Presentation',
        to_meet: 'John Smith',
        comments: 'No comments',
        id_card: '777777777',
        checked_in_by: 'Jane Smith',
        status: 'Approved'
      },
      {
        name: 'John Doe 10',
        organization: 'YZA Company',
        ph_number: '7777777777',
        date: '01/10/2022',
        check_in_time: '06:00 PM',
        check_out_time: '02:00 AM',
        purpose: 'Presentation',
        to_meet: 'John Smith',
        comments: 'No comments',
        id_card: '777777777',
        checked_in_by: 'Jane Smith',
        status: 'Rejected'
      },
      {
        name: 'John Doe 10',
        organization: 'YZA Company',
        ph_number: '7777777777',
        date: '01/10/2022',
        check_in_time: '06:00 PM',
        check_out_time: '02:00 AM',
        purpose: 'Presentation',
        to_meet: 'John Smith',
        comments: 'No comments',
        id_card: '777777777',
        checked_in_by: 'Jane Smith',
        status: 'Approved'
      }
    ]);
  }
}
