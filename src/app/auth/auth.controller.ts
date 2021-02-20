import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ForgotEmailDto, LoginUserDto, RegisterUserDto } from './auth.interface';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {

  constructor(
    private authService: AuthService,
  ) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() data: LoginUserDto) {
    return await this.authService.login(data);
  }

  @Post('register')
  async register(@Body() data: RegisterUserDto) {
    return await this.authService.register(data);
  }

  @Post('forgot')
  @HttpCode(200)
  async forgot(@Body() data: ForgotEmailDto) {
    return await this.authService.forgotPassword(data.email);
  }
}
