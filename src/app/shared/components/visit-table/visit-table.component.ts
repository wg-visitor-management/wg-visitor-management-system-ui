import { Component, ViewChild } from '@angular/core';

import { Table } from 'primeng/table';

import { VISITS_CONSTANTS } from '../../constants/visit-constants';
import { VisitService } from '../../services/visit.service';
import { Visit } from '../../models/visit-model';
import { Column, ExportColumn } from '../../models/pdf_generation_model';

@Component({
  selector: 'app-visit-table',
  templateUrl: './visit-table.component.html',
  styleUrls: ['./visit-table.component.scss']
})
export class VisitTableComponent {
  constants = VISITS_CONSTANTS;
  @ViewChild('dt') dt: Table | undefined;
  rangeDates: Date[] | undefined;

  visits!: Visit[];
  selectedVisit!: Visit[];
  loading: boolean = true;

  constructor(private visitService: VisitService) {}

  cols!: Column[];
  exportColumns!: ExportColumn[];

  ngOnInit() {
    this.visitService.getData().subscribe((visit) => {
      this.visits = visit;
      this.loading = false;
    });

    this.cols = [
      { field: 'name', header: 'Name', customExportHeader: 'Product Code' },
      { field: 'organization', header: 'Organization' },
      { field: 'ph_number', header: 'Phone No' },
      { field: 'check_in_time', header: 'In Time' },
      { field: 'check_out_time', header: 'Out Time' },
      { field: 'purpose', header: 'Purpose' },
      { field: 'to_meet', header: 'To Meet' },
      { field: 'comments', header: 'Comments' },
      { field: 'id_card', header: 'ID Card' },
      { field: 'checked_in_by', header: 'Checked In By' },
      { field: 'status', header: 'Status' }
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field
    }));
  }

  applyFilterGlobal(event: any, stringVal: any) {
    this.dt!.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('l', 'pt', 'a3');
        (doc as any).autoTable(this.exportColumns, this.visits);
        doc.save('VisitDetails.pdf');
      });
    });
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
