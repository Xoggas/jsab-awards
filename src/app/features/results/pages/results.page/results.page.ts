import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {NominationsService} from '../../../voting/services/nominations.service';
import {NominationDto} from '../../../voting/models/nomination.dto';
import {HeaderComponent} from '../../../voting/components/header/header.component';
import {ResultComponent} from '../../components/result.component/result.component';
import {RankingService} from '../../services/ranking.service';
import {RankedEntryDto} from '../../models/ranked-entry.dto';
import {Container} from '../../../../shared/components/container/container';

@Component({
  selector: 'app-results-page',
  imports: [
    HeaderComponent,
    ResultComponent,
    Container
  ],
  templateUrl: './results.page.html',
  styleUrl: './results.page.css',
})
export class ResultsPage implements OnInit {
  nominationsService = inject(NominationsService);
  rankingService = inject(RankingService);

  nominations = signal<NominationDto[]>([]);
  selectedNomination = signal<NominationDto | undefined>(undefined);
  topEntries = signal<RankedEntryDto[]>([]);

  constructor() {
    effect(async () => {
      this.topEntries.set([]);
      const nomination = this.selectedNomination();

      if (!nomination) {
        return;
      }

      const result = await this.rankingService.getTop3EntriesInNomination(nomination);

      if (result.success) {
        this.topEntries.set(result.data);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const result = await this.nominationsService.getNominations();

    if (result.success) {
      this.nominations.set(result.data);
      this.selectedNomination.set(this.nominations()[0]);
    }
  }
}
