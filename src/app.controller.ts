import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Default } from './shared/interfaces/default.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('API Data')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  GET(): Default {
    return this.appService.get();
  }
}
