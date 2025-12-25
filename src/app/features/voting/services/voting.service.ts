import {inject, Injectable} from '@angular/core';
import {EntryDto} from '../models/entry.dto';
import {VoteDto} from '../models/vote.dto';
import {Auth, User} from '@angular/fire/auth';
import {NominationDto} from '../models/nomination.dto';
import {SupabaseService} from '../../../shared/services/supabase.service';
import {fail, Result, success} from '../../../shared/types/result.type';

@Injectable({
  providedIn: 'root',
})
export class VotingService {
  auth = inject(Auth);
  supabase = inject(SupabaseService);

  private getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async getVoteForNomination(nomination: NominationDto): Promise<Result<VoteDto>> {
    const user = this.getCurrentUser();

    if (!user) {
      return fail('User is null');
    }

    const db = this.supabase.client;

    const {data, error} = await db
      .from('votes')
      .select(`
        id,
        user(*),
        entry(
          *,
          nomination(*)
        )
      `)
      .eq('user', user.uid)
      .eq('entry.nomination', nomination.id);

    if (error || data && data.length == 0) {
      return fail('There is no vote');
    }

    // @ts-ignore
    return success(data[0] as VoteDto);
  }

  async addVote(entry: EntryDto): Promise<Result<VoteDto>> {
    const user = this.getCurrentUser();

    if (!user) {
      return fail('User is null');
    }

    const vote = await this.getVoteForNomination(entry.nomination);

    if (vote.success) {
      return fail('User has already voted');
    }

    const db = this.supabase.client;

    const {data: createdVotes} = await db
      .from('votes')
      .insert({
        user: user.uid,
        entry: entry.id
      })
      .select(`
        id,
        user(*),
        entry(
          *,
          nomination(*)
        )
      `);

    if (createdVotes && createdVotes.length > 0) {
      // @ts-ignore
      return success(createdVotes[0] as VoteDto);
    }

    return fail('Error occurred while adding vote');
  }

  async removeVote(vote: VoteDto): Promise<Result<void>> {
    const db = this.supabase.client;

    await db
      .from('votes')
      .delete()
      .eq('id', vote.id);

    return success(undefined);
  }
}
