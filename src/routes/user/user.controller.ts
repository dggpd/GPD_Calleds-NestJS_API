import {
  Body,
  Controller,
  Get,
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

import { SignInAdmDto } from './dto/sign-in.adm.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TurnAdmDto } from './dto/turn-adm.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserViewAdm } from './interfaces/user-view.adm.interface';
import { UserView } from './interfaces/user-view.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('auth/sign-up')
  SIGN_UP(@Body() dto: SignUpDto): Promise<Default> {
    return this.service.signUp(dto);
  }

  @Post('auth/sign-in')
  SIGN_IN(@Body() dto: SignInDto): Promise<Default> {
    return this.service.signIn(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  READ(@Req() req: Request): Promise<UserView> {
    return this.service.read(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('user/update')
  UPDATE(@Req() req: Request, @Body() dto: UpdateUserDto): Promise<Default> {
    return this.service.update(req, dto);
  }

  @Post('auth/adm/sign-in')
  ADM_SIGN_IN(
    @Req() req: Request,
    @Body() dto: SignInAdmDto,
  ): Promise<Default> {
    return this.service.admSignIn(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  @Get('users')
  ADM_READ(@Query() query: ReadQueryAdm): Promise<UserViewAdm[]> {
    return this.service.admRead(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  @Patch('auth/adm/turn-adm')
  ADM_TURN(@Body() dto: TurnAdmDto): Promise<Default> {
    return this.service.admTurn(dto);
  }
}
