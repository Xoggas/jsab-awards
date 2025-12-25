import {NominationDto} from './nomination.dto';

export interface EntryDto {
  id: string;
  link: string;
  name: string;
  nomination: NominationDto;
  type: string;
  channel_link: string;
}
