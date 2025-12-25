import {Component, effect, inject, model, OnInit, signal, untracked} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {NominationsService} from '../../services/nominations.service';
import {NominationDto} from '../../models/nomination.dto';
import {from} from 'rxjs';
import {Container} from '../../../../shared/components/container/container';
import {EntryDto} from '../../models/entry.dto';
import {EntriesService} from '../../services/entries.service';
import {delay} from '../../../../shared/helpers/delay.helper';
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
