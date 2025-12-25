import {EntryDto} from './entry.dto';
import {UserDto} from '../../auth/models/user.dto';

export interface VoteDto {
  id: string;
  entry: EntryDto;
  user: UserDto;
}
