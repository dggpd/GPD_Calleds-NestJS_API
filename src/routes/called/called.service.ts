import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Default } from 'src/shared/interfaces/default.interface';

import { CreateCalledDto } from './dto/create-called.dto';
import { UpdateCalledStatusAdmDto } from './dto/update-called-status.adm.dto';
import { UpdateCalledStatusDto } from './dto/update-called-status.dto';
import { UpdateCalledDto } from './dto/update-called.dto';
import { CalledEntity } from './entities/called.entity';
import { CalledView } from './interfaces/called-view.interface';
import { CalledRepository } from './repositories/called.repository';
import { ReadQueryAdm } from 'src/shared/interfaces/read-query.adm.interface';

@Injectable()
export class CalledService {
  constructor(private readonly repository: CalledRepository) {}

  create(req: Request, dto: CreateCalledDto): Promise<Default> {
    return this.repository.create(req['id'], dto);
  }

  read(req: Request): Promise<CalledView[]> {
    return this.repository.read(req['id']);
  }

  update(req: Request, id: number, dto: UpdateCalledDto): Promise<Default> {
    return this.repository.update(req['id'], id, dto);
  }

  updateStatus(
    id: number,
    { status }: UpdateCalledStatusDto,
  ): Promise<Default> {
    return this.repository.updateStatus(id, status);
  }

  admRead(
    { cpf, name, sector }: ReadQueryAdm,
    authorId?: number,
  ): Promise<CalledEntity[]> {
    return this.repository.adm.read(
      cpf ?? '',
      name ?? '',
      sector ?? '',
      authorId,
    );
  }

  admUpdateStatus(id: number, dto: UpdateCalledStatusAdmDto) {
    return this.repository.adm.updateStatus(id, dto);
  }
}
