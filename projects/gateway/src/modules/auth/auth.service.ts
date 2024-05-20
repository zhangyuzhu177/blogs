import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from 'src/entities/login';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login)
    private readonly _loginRepo: Repository<Login>
  ) { }

  public repo() {
    return this._loginRepo;
  }
}
