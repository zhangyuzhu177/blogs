import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepo: Repository<User>
  ) { }

  public qb(alias = 'u') {
    return this._userRepo.createQueryBuilder(alias)
  }

  public repo() {
    return this._userRepo
  }
}
