import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ pattern: '01234567890' })
  @IsNumberString()
  @Length(11, 11)
  cpf: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ maxLength: 16 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  sector: string;

  @ApiProperty({ pattern: '92987654321' })
  @IsPhoneNumber('BR')
  phone: string;
}
