import {inject, Injectable} from '@angular/core';
import {NominationDto} from '../models/nomination.dto';
import {EntryDto} from '../models/entry.dto';
import {SupabaseService} from '../../../shared/services/supabase.service';
import {fail, Result, success} from '../../../shared/types/result.type';

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  supabase = inject(SupabaseService);

  async getEntriesForNomination(nominationDto: NominationDto): Promise<Result<EntryDto[]>> {
    const db = this.supabase.client;

    const {data, error} = await db
      .from('entries')
      .select(`
        *,
        nomination(*)
      `)
      .eq('nomination', nominationDto.id);

    if (error) {
      return fail("Couldn't find any entries");
    }

    return success(data as EntryDto[]);
  }
}
