import {inject, Injectable} from '@angular/core';
import {EntryDto} from '../models/entry.dto';
import {VoteDto} from '../models/vote.dto';
import {NominationDto} from '../models/nomination.dto';
import {SupabaseService} from '../../../shared/services/supabase.service';
import {fail, Result, success} from '../../../shared/types/result.type';
import {UserService} from '../../auth/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class VotingService {
  supabase = inject(SupabaseService);
  userService = inject(UserService);

  async getVoteForNomination(nomination: NominationDto): Promise<Result<VoteDto>> {
    const user = this.userService.getCurrentUserFromFirebase();

    if (!user) {
      return fail('User is null');
    }

    const db = this.supabase.client;

    const {data, error} = await db
      .from('votes')
      .select(`
        id,
        user(*),
        entry!inner(*, nomination!inner(*))
      `)
      .eq('user', user.uid)
      .eq('entry.nomination.id', nomination.id);

    if (error) {
      return fail(error.message);
    }

    if (data && data.length > 0) {
      // @ts-ignore
      return success(data[0] as VoteDto);
    }

    return fail("Didn't find any vote");
  }

  async addVote(entry: EntryDto): Promise<Result<VoteDto>> {
    const user = this.userService.getCurrentUserFromFirebase();

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
