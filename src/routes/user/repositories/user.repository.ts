import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Default } from 'src/shared/interfaces/default.interface';

import { SignInAdmDto } from '../dto/sign-in.adm.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { TurnAdmDto } from '../dto/turn-adm.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserView } from '../interfaces/user-view.interface';
import { UserViewAdm } from '../interfaces/user-view.adm.interface';

@Injectable()
export class UserRepesitory {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async signUp(dto: SignUpDto): Promise<Default> {
    try {
      await this.prisma.user.create({ data: dto });

      return {
        message: 'Usuário registrado com sucesso.',
        data: dto,
      };
    } catch (err) {
      if (err.code && err.code === 'P2002')
        throw new ConflictException('CPF já cadastrado.');

      console.error(err);
      throw new InternalServerErrorException(
        'Falha ao cadastrar usuário.',
        err,
      );
    }
  }

  async signIn({ cpf }: SignInDto): Promise<Default> {
    const user = await this.prisma.user.findUnique({ where: { cpf } });

    if (!user) throw new NotFoundException('CPF não encontrado.');

    if (user.isAdmin)
      throw new UnauthorizedException(
        'Conta administrativa. É necessário autenticação.',
      );

    const token = this.auth.createAccessToken(user.id, false);

    return {
      message: 'Acesso concedido.',
      data: { isAdmin: false },
      token,
    };
  }

  async read(id: number): Promise<UserView> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const { cpf, name, sector, phone } = user;
    return { cpf, name, sector, phone };
  }

  async update(id: number, dto: UpdateUserDto): Promise<Default> {
    if (dto.name || dto.phone || dto.sector) {
      try {
        await this.prisma.user.update({
          where: { id },
          data: dto,
        });

        return { message: 'Usuário atualizado com sucesso.', data: dto };
      } catch (err) {
        if (err.code && err.code === 'P2025')
          throw new NotFoundException('Usuário não encontrado.');

        console.error(err);
        throw new InternalServerErrorException(
          'Falha na atualização de usuário.',
          err,
        );
      }
    }

    return { message: 'Nothing to update.' };
  }

  adm = {
    signIn: async ({ cpf, password }: SignInAdmDto): Promise<Default> => {
      const user = await this.prisma.user.findUnique({ where: { cpf } });
      if (!user) throw new NotFoundException('CPF não encontrado.');

      if (!user.isAdmin)
        throw new UnauthorizedException(
          'Acesso negado. Este acesso é permitido somente a administradores.',
        );

      if (!user.password)
        await this.prisma.user.update({
          where: { id: user.id },
          data: { password: await bcrypt.hash(password, 10) },
        });
      else await this.checkPassword(user, password);

      const token = this.auth.createAccessToken(user.id, true);

      return {
        message: 'Acesso concedido.',
        data: { isAdmin: true },
        token,
      };
    },
    read: async (
      cpf: string,
      name: string,
      sector: string,
    ): Promise<UserViewAdm[]> => {
      const users = await this.prisma.user.findMany({
        where: {
          AND: [
            { cpf: { contains: cpf, mode: 'insensitive' } },
            { name: { contains: name, mode: 'insensitive' } },
            { sector: { contains: sector, mode: 'insensitive' } },
          ],
        },
      });

      return users.map(
        ({ id, cpf, name, sector, phone, isAdmin, createdAt }) => ({
          id,
          cpf,
          name,
          sector,
          phone,
          isAdmin,
          createdAt,
        }),
      ) as UserViewAdm[];
    },
    turn: async ({ cpf, password }: TurnAdmDto): Promise<Default> => {
      try {
        const user = await this.prisma.user.update({
          where: { cpf },
          data: {
            password: await bcrypt.hash(password, 10),
            isAdmin: true,
          },
        });

        return {
          message: `Usuário atualizado para administrador.`,
          data: {
            cpf,
            name: user.name,
            sector: user.sector,
          },
        };
      } catch (err) {
        if (err.code && err.code === 'P2025')
          throw new NotFoundException('CPF não encontrado.');

        console.error(err);
        throw new InternalServerErrorException(
          'Falha na atualização de conta para administrativa.',
          err,
        );
      }
    },
  };

  // private methods
  private async checkPassword(
    user: UserEntity,
    password: string,
  ): Promise<void> {
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      throw new UnauthorizedException('Acesso negado. Senha incorreta.');
  }
}
