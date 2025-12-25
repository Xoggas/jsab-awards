import {NominationDto} from './nomination.dto';

export interface EntryDto {
  id: string;
  link: string;
  name: string;
  type: string;
  nomination: NominationDto;
}
