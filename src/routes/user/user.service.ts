import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Default } from 'src/shared/interfaces/default.interface';
import { ReadQueryAdm } from 'src/shared/interfaces/read-query.adm.interface';

import { SignInAdmDto } from './dto/sign-in.adm.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TurnAdmDto } from './dto/turn-adm.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserViewAdm } from './interfaces/user-view.adm.interface';
import { UserView } from './interfaces/user-view.interface';
import { UserRepesitory } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepesitory) {}

  signUp(dto: SignUpDto): Promise<Default> {
    return this.repository.signUp(dto);
  }

  signIn(dto: SignInDto): Promise<Default> {
    return this.repository.signIn(dto);
  }

  read(req: Request): Promise<UserView> {
    return this.repository.read(req['id']);
  }

  update(req: Request, dto: UpdateUserDto): Promise<Default> {
    return this.repository.update(req['id'], dto);
  }

  admSignIn(dto: SignInAdmDto): Promise<Default> {
    return this.repository.adm.signIn(dto);
  }

  admRead(query: ReadQueryAdm): Promise<UserViewAdm[]> {
    const cpf = query.cpf ?? '';
    const name = query.name ?? '';
    const sector = query.sector ?? '';

    return this.repository.adm.read(cpf, name, sector);
  }

  admTurn(dto: TurnAdmDto): Promise<Default> {
    return this.repository.adm.turn(dto);
  }
}
