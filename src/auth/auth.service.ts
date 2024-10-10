import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/routes/user/entities/user.entity';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  createAccessToken(id: number, isAdmin: boolean): string {
    return sign({ id, isAdmin }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });
    if (!user) throw new UnauthorizedException('Token inválido.');
    return user;
  }

  returnJwtExtractor(): (req: Request) => string {
    return AuthService.jwtExtractor;
  }

  private static jwtExtractor({ headers }: Request): string {
    if (headers.authorization) {
      const [, token] = headers.authorization.split(' ');

      return token;
    }

    throw new UnauthorizedException('Token inválido.');
  }
}
