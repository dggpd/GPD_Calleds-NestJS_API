import { Module } from '@nestjs/common';

import { PrismaService } from './../../prisma/prisma.service';
import { CalledController } from './called.controller';
import { CalledService } from './called.service';
import { CalledRepository } from './repositories/called.repository';

@Module({
  controllers: [CalledController],
  providers: [PrismaService, CalledService, CalledRepository],
})
export class CalledModule {}
