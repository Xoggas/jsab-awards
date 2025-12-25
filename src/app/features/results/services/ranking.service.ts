import {inject, Injectable} from '@angular/core';
import {SupabaseService} from '../../../shared/services/supabase.service';
import {fail, Result, success} from '../../../shared/types/result.type';
import {RankedEntryDto} from '../models/ranked-entry.dto';
import {NominationDto} from '../../voting/models/nomination.dto';

@Injectable({
  providedIn: 'root',
})
export class RankingService {
  supabase = inject(SupabaseService);

  async getTop3EntriesInNomination(nomination: NominationDto): Promise<Result<RankedEntryDto[]>> {
    const db = this.supabase.client;

    const {data, error} = await db
      .from('top_entries_by_nomination')
      .select('*')
      .eq('nomination', nomination.id)
      .lte('rank', 3)
      .order('rank');

    if (error) {
      return fail("Couldn't find any entries");
    }

    const entries = data as RankedEntryDto[];

    console.log(entries);

    return success(entries);
  }
}


