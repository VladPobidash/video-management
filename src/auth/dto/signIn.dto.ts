import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'user@mail.com', description: 'User email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'password', description: 'User password' })
  @Length(4, 16)
  readonly password: string;
}
