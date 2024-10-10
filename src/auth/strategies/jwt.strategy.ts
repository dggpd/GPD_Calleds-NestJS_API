import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserEntity } from 'src/routes/user/entities/user.entity';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    super({
      jwtFromRequest: auth.returnJwtExtractor(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: JwtPayload): Promise<UserEntity> {
    const user = this.auth.validate(payload);
    if (!user) throw new UnauthorizedException('Token inválido.');
    return user;
  }
}
