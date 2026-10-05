import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('google/register')
  googleRegister(@Body() data: GoogleLoginDto) {
    return this.authService.googleRegister(data);
  }

  @Post('google/login')
  googleLogin(@Body() data: GoogleLoginDto) {
    return this.authService.googleLogin(data);
  }

  @Post('google/profile')
  getGoogleProfile(@Body() data: GoogleLoginDto) {
    return this.authService.getGoogleProfile(data);
  }
}
