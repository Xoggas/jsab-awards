import {Component, inject, OnInit, signal} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {NominationsService} from '../../services/nominations.service';
import {NominationDto} from '../../models/nomination.dto';
import {EntriesGridComponent} from '../../components/entries-grid.component/entries-grid.component';

@Component({
  selector: 'app-voting.page',
  imports: [
    HeaderComponent,
    EntriesGridComponent
  ],
  templateUrl: './voting.page.html',
  styleUrl: './voting.page.css',
})
export class VotingPage implements OnInit {
  nominationsService = inject(NominationsService);

  nominations = signal<NominationDto[]>([]);
  selectedNomination = signal<NominationDto | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    const result = await this.nominationsService.getNominations();

    if (result.success) {
      this.nominations.set(result.data);
      this.selectedNomination.set(this.nominations()[0]);
    }
  }
}
