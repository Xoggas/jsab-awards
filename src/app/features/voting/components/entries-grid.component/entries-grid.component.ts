import {Component, effect, inject, input, signal, untracked} from '@angular/core';
import {EntryDto} from '../../models/entry.dto';
import {NominationDto} from '../../models/nomination.dto';
import {EntriesService} from '../../services/entries.service';
import {VoteDto} from '../../models/vote.dto';
import {VotingService} from '../../services/voting.service';
import {EntryComponent} from '../entry.component/entry.component';

@Component({
  selector: 'app-entries-grid',
  imports: [
    EntryComponent
  ],
  templateUrl: './entries-grid.component.html',
  styleUrl: './entries-grid.component.css',
})
export class EntriesGridComponent {
  entriesService = inject(EntriesService);
  votingService = inject(VotingService);

  emptyEntries = Array(6).fill(0);
  selectedNomination = input.required<NominationDto | undefined>();
  entries = signal<EntryDto[]>([]);
  currentVote = signal<VoteDto | undefined>(undefined);
  waitingForResponse = signal<boolean>(false);

  constructor() {
    effect(async () => {
      const nomination = this.selectedNomination();

      await untracked(async () => {
        this.entries.set([]);
        this.currentVote.set(undefined);

        if (nomination == undefined) {
          return;
        }

        const entriesResult = await this.entriesService.getEntriesForNomination(nomination);

        if (entriesResult.failure) {
          return;
        }

        let shuffled = this.shuffle(entriesResult.data);

        const voteResult = await this.votingService.getVoteForNomination(nomination);

        if (voteResult.success) {
          const vote = voteResult.data;
          shuffled = this.moveVotedEntryForward(shuffled, entry => entry.id == vote.entry.id);
          this.currentVote.set(vote);
        }

        this.entries.set(shuffled);
      })
    });
  }

  shuffle<T>(array: Array<T>): Array<T> {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  moveVotedEntryForward<T>(array: Array<T>, predicate: (a: T) => boolean): Array<T> {
    const result = [...array];
    const pinnedItemIndex = result.findIndex(predicate);
    [result[0], result[pinnedItemIndex]] = [result[pinnedItemIndex], result[0]];
    return result;
  }
}
