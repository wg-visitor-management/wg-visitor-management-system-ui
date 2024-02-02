import { Component, ViewChild } from '@angular/core';

import { Table } from 'primeng/table';

import { VISITS_CONSTANTS } from '../../constants/visit-constants';
import { VisitService } from '../../services/visit.service';
import { Visit } from '../../models/visit-model';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent {
  constants = VISITS_CONSTANTS;
  @ViewChild('dt') dt: Table | undefined;

  visits!: Visit[];
  selectedVisit!: Visit[];
  loading: boolean = true;

  constructor(private customerService: VisitService) {}

  ngOnInit() {
    this.customerService.getData().subscribe((visit) => {
      this.visits = visit;
      this.loading = false;
    });
  }

  applyFilterGlobal(event: any, stringVal: any) {
    this.dt!.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Rejected':
        return 'danger';
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      default:
        return null;
    }
  }
}
