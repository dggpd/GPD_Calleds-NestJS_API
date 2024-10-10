import { Injectable } from '@nestjs/common';

import { Default } from './shared/interfaces/default.interface';

@Injectable()
export class AppService {
  get(): Default {
    return {
      message: 'PROJECT DATA: GPD Calleds API',
      data: {
        version: '1.0.0',
        developedBy: 'Bianca Maxine',
        site: 'biamaxine.github.io',
      },
    };
  }
}
