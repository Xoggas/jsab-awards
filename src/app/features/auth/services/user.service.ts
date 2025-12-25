import {inject, Injectable} from '@angular/core';
import {SupabaseService} from '../../../shared/services/supabase.service';
import {UserDto} from '../models/user.dto';
import {fail, Result, success} from '../../../shared/types/result.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  supabase = inject(SupabaseService);

  async getUserById(id: string): Promise<Result<UserDto>> {
    const db = this.supabase.client;

    const {data: users} = await db
      .from('users')
      .select('id')
      .eq('id', id)
      .limit(1);

    if (users && users.length == 1) {
      return success(users[0] as UserDto);
    }

    return fail('No user with provided ID found');
  }

  async createUser(id: string, username: string): Promise<Result<UserDto>> {
    const db = this.supabase.client;

    const {data: users} = await db
      .from('users')
      .select('id')
      .eq('id', id)
      .limit(1);

    if (users && users.length > 0) {
      return fail('User with provided ID already exists');
    }

    const {data: createdUsers} = await db
      .from('users')
      .insert({
        id: id,
        isAdmin: false,
        username: username
      })
      .select();

    if (createdUsers && createdUsers.length > 0) {
      return success(createdUsers[0]);
    }

    return fail('Failed to create user');
  }
}
