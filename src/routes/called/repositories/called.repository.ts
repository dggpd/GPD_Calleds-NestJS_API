import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Default } from 'src/shared/interfaces/default.interface';

import { CreateCalledDto } from '../dto/create-called.dto';
import { UpdateCalledStatusAdmDto } from '../dto/update-called-status.adm.dto';
import { UpdateCalledDto } from '../dto/update-called.dto';
import { CalledEntity } from '../entities/called.entity';

@Injectable()
export class CalledRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: number, dto: CreateCalledDto): Promise<Default> {
    await this.alreadyThereType(authorId, dto.type);

    try {
      const called = await this.prisma.called.create({
        data: { ...dto, authorId },
      });

      return {
        message: 'Chamado foi enviado com sucesso.',
        data: { ...dto, status: called.status },
      };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Falha ao enviar chamado.', err);
    }
  }

  async read(authorId: number): Promise<CalledEntity[]> {
    const calleds = await this.prisma.called.findMany({
      where: {
        authorId,
        NOT: [{ status: 'RESOLVED' }],
      },
    });

    return calleds.map(
      ({ type, status, description, createdAt, updatedAt }) => ({
        type,
        status,
        description,
        createdAt,
        updatedAt,
      }),
    ) as CalledEntity[];
  }

  async update(
    authorId: number,
    id: number,
    dto: UpdateCalledDto,
  ): Promise<Default> {
    if (!dto.type && !dto.description) return { message: 'Nothing to update.' };

    if (dto.type) await this.alreadyThereType(authorId, dto.type);

    try {
      const called = await this.prisma.called.update({
        where: { id },
        data: { ...dto, updatedAt: new Date() },
      });

      return {
        message: 'Chamado atualizado com sucesso.',
        data: {
          type: dto.type ?? called.type,
          description: dto.description ?? called.description,
          status: called.status,
        },
      };
    } catch (err) {
      if (err.code && err.code === 'P2025')
        throw new NotFoundException('Chamado não foi encontrado.');

      console.error(err);
      throw new InternalServerErrorException(
        'Falha ao atualizar chamado.',
        err,
      );
    }
  }

  async updateStatus(
    id: number,
    status: 'PENDING' | 'CANCELED',
  ): Promise<Default> {
    const verifyCalled = await this.prisma.called.findUnique({ where: { id } });
    if (!verifyCalled) throw new NotFoundException('Chamado não encontrado.');

    if (status === 'PENDING') {
      if (
        verifyCalled.status !== 'NO_ANSWER' &&
        verifyCalled.status !== 'CANCELED'
      )
        throw new BadRequestException(
          `Chamado já foi enviado. O mesmo se encontra "${verifyCalled.status}"`,
        );

      try {
        const called = await this.prisma.called.update({
          where: { id },
          data: { status: 'PENDING', updatedAt: new Date() },
        });

        return {
          message: 'Chamado reenviado com sucesso.',
          data: {
            type: called.type,
            description: called.description,
            status: 'PENDING',
          },
        };
      } catch (err) {
        if (err.code && err.code === 'P2025')
          throw new NotFoundException('Chamado não foi encontrado.');

        console.error(err);
        throw new InternalServerErrorException('Falha ao reenviar chamado.');
      }
    }

    if (
      verifyCalled.status !== 'NO_ANSWER' &&
      verifyCalled.status !== 'NO_SOLUTION' &&
      verifyCalled.status !== 'PENDING'
    )
      throw new BadRequestException(
        `Chamado não pode ser cancelado. O mesmo se encontra "${verifyCalled.status}"`,
      );

    try {
      await this.prisma.called.update({
        where: { id },
        data: { status: 'CANCELED', updatedAt: new Date() },
      });

      return {
        message: 'Chamado cancelado com sucesso.',
      };
    } catch (err) {
      if (err.code && err.code === 'P2025')
        throw new NotFoundException('Chamado não foi encontrado.');

      console.error(err);
      throw new InternalServerErrorException('Falha ao cancelar chamado.', err);
    }
  }

  adm = {
    read: async (
      cpf: string,
      name: string,
      sector: string,
      status: $Enums.CalledStatus,
      authorId?: number,
    ): Promise<CalledEntity[]> => {
      if (authorId) {
        const user = await this.prisma.user.findUnique({
          where: { id: authorId },
        });

        if (!user) throw new NotFoundException('Usuário não encontrado.');

        return await this.prisma.called.findMany({
          where: {
            authorId,
            status,
            NOT: [{ status: 'CANCELED' }],
          },
        });
      }

      return await this.prisma.called.findMany({
        where: {
          OR: await this.prisma.user
            .findMany({
              where: {
                AND: [
                  { cpf: { contains: cpf, mode: 'insensitive' } },
                  { name: { contains: name, mode: 'insensitive' } },
                  { sector: { contains: sector, mode: 'insensitive' } },
                ],
              },
            })
            .then(users => users.map(({ id }) => ({ authorId: id }))),
          status,
          NOT: [{ status: 'CANCELED' }],
        },
      });
    },
    updateStatus: async (
      id: number,
      dto: UpdateCalledStatusAdmDto,
    ): Promise<Default> => {
      if (dto.status === 'OPENED' || dto.status === 'NO_ANSWER') {
        try {
          await this.prisma.called.update({
            where: { id },
            data: { status: dto.status, updatedAt: new Date() },
          });

          return {
            message:
              dto.status === 'OPENED'
                ? 'Chamado foi aberto.'
                : 'Chamado foi atualizado para "sem resposta".',
          };
        } catch (err) {
          if (err.code && err.code === 'P2025')
            throw new NotFoundException('Chamado não foi encontrado.');

          console.error(err);
          throw new InternalServerErrorException(
            dto.status === 'OPENED'
              ? 'Falha ao abrir chamado.'
              : 'Falaha ao atualizar chamado para "sem resposta".',
          );
        }
      }

      try {
        await this.prisma.called.update({
          where: { id },
          data: { ...dto, updatedAt: new Date() },
        });

        return {
          message:
            dto.status === 'RESOLVED'
              ? 'Chamado foi resolvido.'
              : 'Chamado atualizado para "sem solução".',
        };
      } catch (err) {
        if (err.code && err.code === 'P2025')
          throw new NotFoundException('Chamado não foi encontrado.');

        console.error(err);
        throw new InternalServerErrorException(
          dto.status === 'RESOLVED'
            ? 'Falha ao resolver chamado'
            : 'Falha ao atualizar chamado para "sem solução".',
        );
      }
    },
  };

  // private method
  private async alreadyThereType(
    authorId: number,
    type: $Enums.CalledType,
  ): Promise<void> {
    const calleds = await this.prisma.called.findMany({
      where: { authorId, type },
    });

    for (const { status } of calleds) {
      if (status === 'OPENED' || status === 'PENDING')
        throw new ConflictException(
          `Usuário já enviou este chamado. O mesmo se encontra "${status}"`,
        );
    }
  }
}
