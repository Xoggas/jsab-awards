import {inject, Injectable} from '@angular/core';
import {NominationDto} from '../models/nomination.dto';
import {SupabaseService} from '../../../shared/services/supabase.service';
import {fail, Result, success} from '../../../shared/types/result.type';

@Injectable({
  providedIn: 'root',
})
export class NominationsService {
  supabase = inject(SupabaseService);

  async getNominations(): Promise<Result<NominationDto[]>> {
    const db = this.supabase.client;
    const {data, error} = await db
      .from("nominations")
      .select('*');

    if (error) {
      return fail("No nominations found");
    }

    const nominations = data as NominationDto[];
    return success(nominations.sort((a, b) => a.order - b.order));
  }
}
