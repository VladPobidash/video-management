import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Public } from './public';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'SignIn' })
  @ApiResponse({
    status: 200,
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm...',
    },
  })
  signIn(@Body() { email, password }: SignInDto) {
    return this.authService.signIn(email, password);
  }

  @Public()
  @Post('/registration')
  @ApiOperation({ summary: 'SignUp' })
  @ApiResponse({
    status: 200,
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybm...',
    },
  })
  signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }
}
