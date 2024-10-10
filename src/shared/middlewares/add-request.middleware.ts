import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AddRequestMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    if (req.headers.authorization) {
      const [, token] = req.headers.authorization.split(' ');

      const payload = verify(token, process.env.JWT_SECRET) as JwtPayload;
      if (typeof payload === 'object' && payload !== null) {
        if ('id' in payload) req['id'] = payload.id;

        if ('isAdmin' in payload) req['isAdmin'] = payload.isAdmin;
      }
    }

    next();
  }
}
