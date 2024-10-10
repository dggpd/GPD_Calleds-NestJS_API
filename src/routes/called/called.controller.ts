import { $Enums } from '@prisma/client';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminGuard } from 'src/shared/guards/admin.guard';
import { Default } from 'src/shared/interfaces/default.interface';
import { ReadQueryAdm } from 'src/shared/interfaces/read-query.adm.interface';

import { CalledService } from './called.service';
import { CreateCalledDto } from './dto/create-called.dto';
import { UpdateCalledStatusAdmDto } from './dto/update-called-status.adm.dto';
import { UpdateCalledStatusDto } from './dto/update-called-status.dto';
import { UpdateCalledDto } from './dto/update-called.dto';
import { CalledEntity } from './entities/called.entity';
import { CalledView } from './interfaces/called-view.interface';

@ApiTags('Called')
@UseGuards(AuthGuard('jwt'))
@Controller()
export class CalledController {
  constructor(private readonly service: CalledService) {}

  @Post('called')
  CREATE(@Req() req: Request, @Body() dto: CreateCalledDto): Promise<Default> {
    return this.service.create(req, dto);
  }

  @Get('called')
  READ(@Req() req: Request): Promise<CalledView[]> {
    return this.service.read(req);
  }

  @Patch('called/update/:id')
  UPDATE(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateCalledDto,
  ): Promise<Default> {
    return this.service.update(req, +id, dto);
  }

  @Patch('called/update-status/:id')
  UPDATE_STATUS(
    @Param('id') id: string,
    @Body() dto: UpdateCalledStatusDto,
  ): Promise<Default> {
    return this.service.updateStatus(+id, dto);
  }

  @UseGuards(AdminGuard)
  @Get(['access-admin/calleds', 'acess-admin/user/:id/calleds'])
  ADM_READ(
    @Query() query: ReadQueryAdm & { status?: $Enums.CalledStatus },
    @Param('id') authorId?: string,
  ): Promise<CalledEntity[]> {
    return this.service.admRead(query, +authorId);
  }

  @UseGuards(AdminGuard)
  @Patch('access-admin/called/:id/update-status')
  ADM_UPDATE_STATUS(
    @Param('id') id: string,
    @Body() dto: UpdateCalledStatusAdmDto,
  ) {
    return this.service.admUpdateStatus(+id, dto);
  }
}
