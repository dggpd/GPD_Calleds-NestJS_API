import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({ pattern: '01234567890' })
  @IsNumberString()
  @Length(11, 11)
  cpf: string;
}
