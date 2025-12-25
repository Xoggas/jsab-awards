import {Component, input, model} from '@angular/core';
import {NominationDto} from '../../models/nomination.dto';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  emptyItems = new Array(5).fill(0);
  nominations = input.required<NominationDto[]>();
  selectedNomination = model<NominationDto>();

  selectNomination(nominationDto: NominationDto): void {
    this.selectedNomination.set(nominationDto);
  }
}
