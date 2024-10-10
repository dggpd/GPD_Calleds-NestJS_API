import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class TurnAdmDto {
  @ApiProperty({ pattern: '01234567890' })
  @IsNumberString()
  @Length(11, 11)
  cpf: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
