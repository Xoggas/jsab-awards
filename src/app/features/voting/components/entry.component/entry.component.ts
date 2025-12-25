import {Component, effect, inject, input, model, Sanitizer, signal, untracked} from '@angular/core';
import {VoteDto} from '../../models/vote.dto';
import {EntryDto} from '../../models/entry.dto';
import {VotingService} from '../../services/voting.service';
import {Button} from '../../../../shared/components/button/button';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {delay} from '../../../../shared/helpers/delay.helper';

@Component({
  selector: 'app-entry',
  imports: [
    Button
  ],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.css',
})
export class EntryComponent {
  votingService = inject(VotingService);
  sanitizer = inject(DomSanitizer);

  safeUrl: SafeResourceUrl | undefined = undefined;
  entry = input.required<EntryDto>();
  currentVote = model.required<VoteDto | undefined>();
  waitingForResponse = model.required<boolean>();

  buttonText = signal<string>("");
  isButtonDisabled = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.entry().link);
    });

    effect(() => {
      const currentVote = this.currentVote();
      const entry = this.entry();

      untracked(() => {
        if (currentVote == undefined) {
          this.buttonText.set("Vote");
          this.isButtonDisabled.set(false);
        }
        else if (currentVote.entry.id == entry.id) {
          this.buttonText.set("Remove vote");
          this.isButtonDisabled.set(false);
        }
        else {
          this.buttonText.set("You've already voted");
          this.isButtonDisabled.set(true);
        }
      });
    });
  }

  async toggleVote(): Promise<void> {
    this.waitingForResponse.set(true);

    if (this.currentVote()?.entry.id == this.entry().id) {
      await this.removeVote();
    }
    else {
      await this.voteFor(this.entry());
    }

    this.waitingForResponse.set(false);
  }

  private async voteFor(entry: EntryDto): Promise<void> {
    const result = await this.votingService.addVote(entry);

    await delay(1000);

    if (result.success) {
      this.currentVote.set(result.data);
    }
  }

  private async removeVote(): Promise<void> {
    const vote = this.currentVote();

    if (vote == undefined) {
      return;
    }

    const result = await this.votingService.removeVote(vote);

    await delay(1000);

    if (result.success) {
      this.currentVote.set(undefined);
    }
  }
}
