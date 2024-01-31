import { Component } from '@angular/core';

import { VISITS_CONSTANTS } from '../../constants/visit-constants';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent {
  constants = VISITS_CONSTANTS;
}
